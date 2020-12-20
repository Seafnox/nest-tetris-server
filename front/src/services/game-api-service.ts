import { DirectionDto } from '~tetris/dto/direction-dto';
import io from 'socket.io-client';
import { SocketEventDto } from '~tetris/dto/socket-event-dto';

export class GameApiService {
  private socket: SocketIOClient.Socket;

  public init(): void {
    this.socket = io();
  }

  public registerUser(username: string): void {
    this.socket.emit(SocketEventDto.RegisterUser, username);
  }

  public startWatching(): void {
    this.socket.emit(SocketEventDto.StartWatchingMode);
  }

  public startPlaying(): void {
    this.socket.emit(SocketEventDto.StartPlayingMode);
    this.socket.emit(SocketEventDto.StartNewGame);
  }

  public moveFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEventDto.MoveFigure, direction);
  }

  public rotateFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEventDto.RotateFigure, direction);
  }

  public dropFigure(): void {
    this.socket.emit(SocketEventDto.DropFigure);
  }

  public onLoginSuccess(cb): void {
    this.socket.on(SocketEventDto.UserLoginSuccess, cb);
  }

  public onUpdateGameState(cb): void {
    this.socket.on(SocketEventDto.UpdateGameView, cb);
  }

  public onUpdateNextItem(cb): void {
    this.socket.on(SocketEventDto.UpdateNextFigure, cb);
  }

  public onUpdateScore(cb): void {
    this.socket.on(SocketEventDto.UpdateScore, cb);
  }

  public onUpdateLevel(cb): void {
    this.socket.on(SocketEventDto.UpdateLevel, cb);
  }

  public onAddUser(cb): void {
    this.socket.on(SocketEventDto.AddUser, cb);
  }

  public onRemoveUser(cb): void {
    this.socket.on(SocketEventDto.RemoveUser, cb);
  }

  public onDisconnect(cb): void {
    this.socket.on(SocketEventDto.Disconnect, cb);
  }

  public onConnect(cb): void {
    this.socket.on(SocketEventDto.Connect, cb);
  }

  public onReconnectSuccess(cb): void {
    this.socket.on(SocketEventDto.ReconnectSuccess, cb);
  }

  public onReconnectFail(cb): void {
    this.socket.on(SocketEventDto.ReconnectFailed, cb);
  }
}
