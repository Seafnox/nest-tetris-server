import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BaseServerEventDto } from '~tetris/dto/base-server-event-dto';
import { RegisterUserEventDto } from '~tetris/dto/register-user-event-dto';
import { SocketEvent } from '~tetris/dto/socket-event';
import { RecordLike } from '../../interfaces/record-like';
import { GameService } from '../../services/game.service';
import { XSocketClient } from '../../interfaces/x-socket-client';

@WebSocketGateway({
  cors: {
    origin: "localhost",
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true
  }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private watchers: string[] = [];

  constructor(private gameService: GameService) {
    this.gameService.emit$().subscribe(event => this.emit(event.playerId, event.eventName, event.data));
  }

  @SubscribeMessage(SocketEvent.RegisterUser)
  addUser(player: XSocketClient, payload: RegisterUserEventDto): void {
    player.name = payload.userName.toString();
    console.log(SocketEvent.RegisterUser, player.id, player.name);

    const numUsers = this.getConnectedClientCount();

    this.broadcastFromPlayer<BaseServerEventDto>(player, SocketEvent.AddUser, { numUsers });
    this.emitToWatcher<BaseServerEventDto>(player, player, SocketEvent.UserLoginSuccess, { numUsers });
  }

  @SubscribeMessage(SocketEvent.StartNewGame)
  startGame(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.StartNewGame, player.id, player.name, JSON.stringify(payload));
    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);

    this.gameService.startPlayerGame(player.id);
  }

  @SubscribeMessage(SocketEvent.StopPlayingMode)
  stopPlaying(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.StopPlayingMode, player.id, player.name, JSON.stringify(payload));
    this.gameService.stopPlayerGame(player.id);
  }

  @SubscribeMessage(SocketEvent.StartWatchingMode)
  startWatching(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.StartWatchingMode, player.id, player.name, JSON.stringify(payload));
    this.gameService.stopPlayerGame(player.id);

    this.watchers = [player.id, ...this.watchers];
  }

  @SubscribeMessage(SocketEvent.StopWatchingMode)
  stopWatching(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.StopWatchingMode, player.id, player.name, JSON.stringify(payload));

    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);
  }

  @SubscribeMessage(SocketEvent.MoveFigure)
  moveFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.MoveFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEvent.MoveFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage(SocketEvent.RotateFigure)
  rotateFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.RotateFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEvent.RotateFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage(SocketEvent.DropFigure)
  dropFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEvent.DropFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEvent.DropFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage(SocketEvent.ConnectFailed)
  public onConnected<T>(player: XSocketClient, ...args: T[]): void {
    console.log(SocketEvent.ConnectFailed, 'v2', player.id, player.name, args);
  }

  @SubscribeMessage(SocketEvent.ConnectSuccess)
  public onConnectFailed<T>(player: XSocketClient, ...args: T[]): void {
    console.log(SocketEvent.ConnectSuccess, 'v2', player.id, player.name, args);
  }

  public handleConnection<T>(player: XSocketClient, ...args: T[]): void {
    console.log(SocketEvent.ConnectSuccess, player.id, player.name, args);
  }

  public handleDisconnect(player: XSocketClient): void {
    console.log(SocketEvent.Disconnect, player.id, player.name);

    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);
    this.gameService.stopPlayerGame(player.id);

    this.broadcastFromPlayer(player, SocketEvent.RemoveUser, { numUsers: this.getConnectedClientCount() });
  }

  private getConnectedClientCount(): number {
    return this.server.sockets.sockets.size;
  }

  private broadcastFromPlayer<Dto extends RecordLike>(player: XSocketClient, eventName: string, data: Omit<Dto, 'id'|'name'>): void {
    this.broadcast(eventName, {
      id: player.id,
      name: player.name,
      ...data,
    })
  }

  private broadcast<Dto extends RecordLike>(eventName: string, data: Dto): void {
    this.server.emit(eventName, data);
  }

  private emit<Dto extends RecordLike>(playerId: string, eventName: string, data?: Omit<Dto, 'id'|'name'>): void {
    const targetIds = [playerId, ...this.watchers];
    const player: XSocketClient = this.server.sockets.sockets.get(playerId);

    targetIds.forEach(targetId => {
      const watcher: XSocketClient = this.server.sockets.sockets.get(targetId);

      this.emitToWatcher(watcher, player, eventName, data);
    })
  }

  private emitToWatcher<Dto extends RecordLike>(watcher: XSocketClient, player: XSocketClient, eventName: string, data: Omit<Dto, 'id'|'name'>): void {
    watcher.emit( eventName, {
      id: player.id,
      username: player.name,
      ...data,
    });
  }
}
