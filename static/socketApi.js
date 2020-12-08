class SocketApi {
  socket;

  init() {
    this.socket = io();
  }

  addUser(username) {
    this.socket.emit('add user', username);
  }

  startWatching() {
    this.socket.emit('startWatching');
  }

  startPlaying() {
    this.socket.emit('startGame');
  }

  moveFigure(direction) {
    this.socket.emit('moveFigure', direction);
  }

  rotateFigure(direction) {
    this.socket.emit('rotateFigure', direction);
  }

  dropFigure() {
    this.socket.emit('dropFigure');
  }

  onLoginSuccess(cb) {
    this.socket.on('login', cb);
  }

  onUpdateGameState(cb) {
    this.socket.on('newGameState', cb);
  }

  onUpdateNextItem(cb) {
    this.socket.on('newNextItem', cb);
  }

  onUpdateScore(cb) {
    this.socket.on('newScore', cb);
  }

  onUpdateLevel(cb) {
    this.socket.on('newLvl', cb);
  }

  onAddUser(cb) {
    this.socket.on('user joined', cb);
  }

  onRemoveUser(cb) {
    this.socket.on('user left', cb);
  }

  onDisconnect(cb) {
    this.socket.on('disconnect', cb);
  }

  onReconnectSuccess(cb) {
    this.socket.on('reconnect', cb);
  }

  onReconnectFail(cb) {
    this.socket.on('reconnect_error', cb);
  }
}

if (!!module && !!module.exports) {
  module.exports = SocketApi;
}
