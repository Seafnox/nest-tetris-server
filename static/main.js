$(function() {
    var FADE_TIME = 150; // ms

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('#usernameInput'); // Input for username
    var $messages = $('#messages'); // Messages area

    var $loginPage = $('#loginPage'); // The login page
    var $gamePage = $('#gamePage'); // The chatroom page
    var $watchingPage = $('#watchingPage'); // The chatroom page
    var $watchButton = $('.watchButton');
    var $playButton = $('.playButton');
    var $ownGameContainer = $('#ownGame');
    var $watchingRootContainer = $('#watchedGames');
    var $watchingContainers = {};
    var isWatchingMode = false;

    // Prompt for setting a username
    var username;
    $usernameInput.val(`test-${Math.floor(Math.random()*1000)}`);

    var socketApi = new SocketApi();
    socketApi.init();

    const addParticipantsMessage = (data) => {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    }

    // Sets the client's username
    const setUsername = () => {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $gamePage.show();
            $loginPage.off('click');

            // Tell the server your username
            socketApi.addUser(username);
        }
    }

    // Log a message
    const log = (message, options) => {
        var $el = $('<div>').addClass('message log').text(message);
        addMessageElement($el, options);
    }

    const addMessageElement = (el, options) => {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        $messages.append($el);
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    const cleanInput = (input) => $('<div/>').text(input).html();

    const createGameView = ($parent) => {
        $parent[0].innerHTML = `<game-wrapper></game-wrapper>`;

        return getGameViewSimple($parent);
    }

    const getGameViewSimple = ($parent) => {
        return $parent[0].getElementsByTagName('game-wrapper')[0];
    }

    const getGameView = ($parent) => {
        return getGameViewSimple($parent) || createGameView($parent);
    }

    const createPlayerContainer = (playerId) => {
        $watchingRootContainer[0].innerHTML = `${$watchingRootContainer[0].innerHTML}<div id="${playerId}container"></div>`;
        $watchingContainers[playerId] = $(`#${playerId}container`);

        return getPlayerContainerSimple(playerId);
    }

    const getPlayerContainerSimple = (playerId) => {
        return $watchingContainers[playerId];
    }

    const getPlayerContainer = (playerId) => {
        return getPlayerContainerSimple(playerId) || createPlayerContainer(playerId);
    }

    const updateOwnGameState = (state) => {
        const view = getGameView($ownGameContainer);
        view.state = JSON.stringify(state);
    }

    const updatePlayerGameState = (playerId, state) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.state = JSON.stringify(state);
    }

    const updateOwnNextItem = (state) => {
        const view = getGameView($ownGameContainer);
        view.nextItem = JSON.stringify(state);
    }

    const updatePlayerNextItem = (playerId, state) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.nextItem = JSON.stringify(state);
    }

    const updateOwnScore = (value) => {
        const view = getGameView($ownGameContainer);
        view.score = value;
    }

    const updatePlayerScore = (playerId, value) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.score = value;
    }

    const updateOwnLevel = (value) => {
        const view = getGameView($ownGameContainer);
        view.level = value;
    }

    const updatePlayerLevel = (playerId, value) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.level = value;
    }

    const startWatching = (emitting) => {
        if (emitting) {
            socketApi.startWatching();
        }
        isWatchingMode = true;
        $gamePage.fadeOut();
        $watchingPage.show();
    }

    const startPlaying = (emitting) => {
        $watchingPage.fadeOut();
        $gamePage.show();
        if (emitting) {
            socketApi.startPlaying();
        }
        isWatchingMode = false;
    }

    // Keyboard events
    const gameKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
    ];

    const gameActions = (socketApi) => ({
        ArrowLeft: socketApi.moveFigure.bind(socketApi, 'left'),
        ArrowRight: socketApi.moveFigure.bind(socketApi, 'right'),
        ArrowUp: socketApi.rotateFigure.bind(socketApi, 'right'),
        ArrowDown: socketApi.dropFigure.bind(socketApi),
    });

    //key: "ArrowLeft", keyCode: 37
    //key: "ArrowRight", keyCode: 39
    //key: "ArrowUp", keyCode: 38
    //key: "ArrowDown", keyCode: 40
    $window.keydown(event => {
        if (gameKeys.includes(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();

            gameActions(socketApi)[event.key]();

            return;
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13 && !username) {
            setUsername();
        }
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $usernameInput.focus()
    });

    $watchButton.click(() => startWatching(true))

    $playButton.click(() => startPlaying(true))

    // Socket events

    // Whenever the server emits 'login', log the login message
    socketApi.onLoginSuccess((data) => {
        addParticipantsMessage(data);
        socketApi.startWatching();
        isWatchingMode = true;
    });

    socketApi.onUpdateGameState(data => {
        isWatchingMode ? updatePlayerGameState(data.id, data.state) : updateOwnGameState(data.state);
    })

    socketApi.onUpdateNextItem(data => {
        isWatchingMode ? updatePlayerNextItem(data.id, data.item) : updateOwnNextItem(data.item);
    })

    socketApi.onUpdateScore(data => {
        isWatchingMode ? updatePlayerScore(data.id, data.value) : updateOwnScore(data.value);
    })

    socketApi.onUpdateLevel(data => {
        isWatchingMode ? updatePlayerLevel(data.id, data.value) : updateOwnLevel(data.value);
    })

    // Whenever the server emits 'user joined', log it in the chat body
    socketApi.onAddUser((data) => {
        log(`user joined: '${JSON.stringify(data)}', isMe: ${data.username === username}`)
        if (data.username !== username){
            log(data.username + ' joined');
            addParticipantsMessage(data);
        }
    });

    // Whenever the server emits 'user left', log it in the chat body
    socketApi.onRemoveUser((data) => {
        log(data.username + ' left');
        addParticipantsMessage(data);
    });

    socketApi.onDisconnect(() => {
        log('you have been disconnected');
        startWatching();
    });

    socketApi.onReconnectSuccess(() => {
        log('you have been reconnected');
        if (username) {
            startWatching();
            socketApi.addUser(username);
        }
    });

    socketApi.onReconnectFail(() => {
        log('attempt to reconnect has failed');
    });

    setUsername();
});
