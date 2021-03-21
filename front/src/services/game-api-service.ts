import { BehaviorSubject, Observable, fromEventPattern } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { BaseServerEventDto } from '~tetris/dto/base-server-event-dto';
import { DirectionDto } from '~tetris/dto/direction-dto';
import io from 'socket.io-client';
import { GameStateEventDto } from '~tetris/dto/game-state-event.dto';
import { LevelEventDto } from '~tetris/dto/level-event.dto';
import { NextItemEventDto } from '~tetris/dto/next-item-event.dto';
import { RegisterUserEventDto } from '~tetris/dto/register-user-event-dto';
import { ScoreEventDto } from '~tetris/dto/score-event.dto';
import { ServerEventDto } from '~tetris/dto/server-event.dto';
import { SocketEvent } from '~tetris/dto/socket-event';
import { Logger } from './logger/logger';

export class GameApiService {
  private readonly socket: SocketIOClient.Socket = io("http://127.0.0.1:3000/", {
    upgrade: true,
    transports: ['websocket'],
  });

  private readonly _isConnected = new BehaviorSubject(false);

  constructor() {
    this._isConnected.next(this.socket.connected);

    this.onConnected$.subscribe(data => {
      this._isConnected.next(true);
      console.log('[WIP] GameApiService:onConnect', data);
    });

    this.onConnectFailed$.subscribe(data => {
      this._isConnected.next(false);
      console.log('[WIP] GameApiService:onConnectFailed', data);
    });

    this.onDisconnected$.subscribe(data => {
      this._isConnected.next(false);
      console.log('[WIP] GameApiService:onDisconnect', data);
    });

    this.onReconnectSuccess$.subscribe(data => console.log('[WIP] GameApiService:onReconnectSuccess', data));
    this.onReconnectFail$.subscribe(data => console.log('[WIP] GameApiService:onReconnectFail', data));
    this.onReconnectFailed$.subscribe(data => console.log('[WIP] GameApiService:onReconnectFailed', data));

    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public whenConnected$(): Observable<boolean> {
    return this._isConnected.asObservable().pipe(
      filter<boolean>(Boolean),
      take(1)
    );
  }

  @Logger()
  public registerUser(dto: RegisterUserEventDto): void {
    this.socket.emit(SocketEvent.RegisterUser, dto);
  }

  @Logger()
  public startWatching(): void {
    this.socket.emit(SocketEvent.StartWatchingMode);
  }

  @Logger()
  public stopWatching(): void {
    this.socket.emit(SocketEvent.StopWatchingMode);
  }

  @Logger()
  public startPlaying(): void {
    this.socket.emit(SocketEvent.StartPlayingMode);
    this.socket.emit(SocketEvent.StartNewGame);
  }

  @Logger()
  public stopPlaying(): void {
    this.socket.emit(SocketEvent.StopPlayingMode);
  }

  @Logger()
  public moveFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEvent.MoveFigure, direction);
  }

  @Logger()
  public rotateFigure(direction: DirectionDto): void {
    this.socket.emit(SocketEvent.RotateFigure, direction);
  }

  @Logger()
  public dropFigure(): void {
    this.socket.emit(SocketEvent.DropFigure);
  }

  public get onSignOn$(): Observable<BaseServerEventDto> {
    return this.actionToStream$(SocketEvent.UserLoginSuccess);
  }

  public get onGameFieldUpdated$(): Observable<GameStateEventDto> {
    return this.actionToStream$(SocketEvent.UpdateGameView);
  }

  public get onNextItemUpdated$(): Observable<NextItemEventDto> {
    return this.actionToStream$(SocketEvent.UpdateNextFigure);
  }

  public get onScoreUpdated$(): Observable<ScoreEventDto> {
    return this.actionToStream$(SocketEvent.UpdateScore);
  }

  public get onLevelUpdated$(): Observable<LevelEventDto> {
    return this.actionToStream$(SocketEvent.UpdateLevel);
  }

  public get onUserAdded$(): Observable<BaseServerEventDto> {
    return this.actionToStream$(SocketEvent.AddUser);
  }

  public get onUserRemoved$(): Observable<BaseServerEventDto> {
    return this.actionToStream$(SocketEvent.RemoveUser);
  }

  public get onDisconnected$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.Disconnect);
  }

  public get onConnected$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.ConnectSuccess);
  }

  public get onConnectFailed$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.ConnectFailed);
  }

  public get onReconnectSuccess$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.ReconnectSuccess);
  }

  public get onReconnectFail$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.ReconnectError);
  }

  public get onReconnectFailed$(): Observable<ServerEventDto> {
    return this.actionToStream$(SocketEvent.ReconnectFailed);
  }

  private actionToStream$<T>(event: SocketEvent): Observable<T> {
    const addCbHandler = this.socket.addEventListener.bind(this.socket, event);
    const removeCbHandler = this.socket.removeEventListener.bind(this.socket, event);
    return fromEventPattern(addCbHandler, removeCbHandler);
  }
}
