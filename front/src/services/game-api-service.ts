import { BaseServerEventDto } from '~tetris/dto/base-server-event-dto';
import { DirectionDto } from '~tetris/dto/direction-dto';
import io from 'socket.io-client';
import { RegisterUserEventDto } from '~tetris/dto/register-user-event-dto';
import { SocketEvent } from '~tetris/dto/socket-event';

export type DtoHandler<Dto> = (dto: Dto) => void;

export class GameApiService {
  private socket: SocketIOClient.Socket = io();

  public registerUser(dto: RegisterUserEventDto): void {
    this.socket.emit(SocketEvent.RegisterUser, dto);
  }

  public startWatching(): void {
    this.socket.emit(SocketEvent.StartWatchingMode);
  }

  public startPlaying(): void {
    this.socket.emit(SocketEvent.StartPlayingMode);
    this.socket.emit(SocketEvent.StartNewGame);
  }

  public moveFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEvent.MoveFigure, direction);
  }

  public rotateFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEvent.RotateFigure, direction);
  }

  public dropFigure(): void {
    this.socket.emit(SocketEvent.DropFigure);
  }

  public onLoginSuccess(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.UserLoginSuccess, cb);
  }

  public onUpdateGameState(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.UpdateGameView, cb);
  }

  public onUpdateNextItem(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.UpdateNextFigure, cb);
  }

  public onUpdateScore(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.UpdateScore, cb);
  }

  public onUpdateLevel(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.UpdateLevel, cb);
  }

  public onAddUser(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.AddUser, cb);
  }

  public onRemoveUser(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.RemoveUser, cb);
  }

  public onDisconnect(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.Disconnect, cb);
  }

  public onConnect(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.Connect, cb);
  }

  public onReconnectSuccess(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.ReconnectSuccess, cb);
  }

  public onReconnectFail(cb: DtoHandler<BaseServerEventDto>): void {
    this.socket.on(SocketEvent.ReconnectFailed, cb);
  }
}
