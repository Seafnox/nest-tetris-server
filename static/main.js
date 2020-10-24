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

    var socket = io();

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
            socket.emit('add user', username);
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
        $parent[0].innerHtml = `<game-wrapper></game-wrapper>`;

        return getGameViewSimple($parent);
    }

    const getGameViewSimple = ($parent) => {
        return $parent[0].getElementsByTagName('game-wrapper')[0];
    }

    const getGameView = ($parent) => {
        return getGameViewSimple($parent) || createGameView($parent);
    }

    const createPlayerContainer = (playerId) => {
        $watchingRootContainer.appendChild(`<div id="${playerId}container"></div>`);
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
        view.setAttribute('state', state);
    }

    const updatePlayerGameState = (playerId, state) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.setAttribute('state', state);
    }

    const updateOwnNextItem = (state) => {
        const view = getGameView($ownGameContainer);
        view.setAttribute('nextItem', state);
    }

    const updatePlayerNextItem = (playerId, state) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.setAttribute('nextItem', state);
    }

    const updateOwnScore = (value) => {
        const view = getGameView($ownGameContainer);
        view.setAttribute('score', value);
    }

    const updatePlayerScore = (playerId, value) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.setAttribute('score', value);
    }

    const updateOwnLevel = (value) => {
        const view = getGameView($ownGameContainer);
        view.setAttribute('level', value);
    }

    const updatePlayerLevel = (playerId, value) => {
        const $playerContainer = getPlayerContainer(playerId);
        const view = getGameView($playerContainer);
        view.setAttribute('level', value);
    }

    // Keyboard events
    const gameKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
    ];

    const gameActions = (socket) => ({
        ArrowLeft: socket.emit.bind(socket, 'moveFigure', 'left'),
        ArrowRight: socket.emit.bind(socket, 'moveFigure', 'right'),
        ArrowUp: socket.emit.bind(socket, 'rotateFigure', 'right'),
        ArrowDown: socket.emit.bind(socket, 'dropFigure'),
    });

    //key: "ArrowLeft", keyCode: 37
    //key: "ArrowRight", keyCode: 39
    //key: "ArrowUp", keyCode: 38
    //key: "ArrowDown", keyCode: 40
    $window.keydown(event => {
        if (gameKeys.includes(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();

            gameActions(socket)[event.key]();

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

    $watchButton.click(() => {
        socket.emit('startWatching');
        isWatchingMode = true;
        $gamePage.fadeOut();
        $watchingPage.show();
    })

    $playButton.click(() => {
        $watchingPage.fadeOut();
        $gamePage.show();
        socket.emit('startGame');
        isWatchingMode = false;
    })

    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
        addParticipantsMessage(data);
        socket.emit('startWatching');
        isWatchingMode = true;
    });

    socket.on('newGameState', data => {
        console.log('newGameState', data.id);
        isWatchingMode ? updatePlayerGameState(data.id, data.state) : updateOwnGameState(data.state);
    })

    socket.on('newNextItem', data => {
        console.log('newNextItem', data.id);
        isWatchingMode ? updatePlayerNextItem(data.id, data.item) : updateOwnNextItem(data.item);
    })

    socket.on('newScore', data => {
        console.log('newScore', data.id, data.value);
        isWatchingMode ? updatePlayerScore(data.id, data.value) : updateOwnScore(data.value);
    })

    socket.on('newLvl', data => {
        console.log('newLvl', data.id, data.value);
        isWatchingMode ? updatePlayerLevel(data.id, data.value) : updateOwnLevel(data.value);
    })

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
        log(`user joined: '${JSON.stringify(data)}', isMe: ${data.username === username}`)
        if (data.username !== username){
            log(data.username + ' joined');
            addParticipantsMessage(data);
        }
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
        log(data.username + ' left');
        addParticipantsMessage(data);
    });

    socket.on('disconnect', () => {
        log('you have been disconnected');
    });

    socket.on('reconnect', () => {
        log('you have been reconnected');
        if (username) {
            socket.emit('add user', username);
        }
    });

    socket.on('reconnect_error', () => {
        log('attempt to reconnect has failed');
    });

    setUsername();
});
