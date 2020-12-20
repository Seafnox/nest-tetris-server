import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketEventDto } from '~tetris/dto/socket-event-dto';
import { RecordLike } from '../../interfaces/record-like';
import { GameService } from '../../services/game.service';
import { XSocketClient } from '../../interfaces/x-socket-client';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private watchers: string[] = [];

  constructor(private gameService: GameService) {
    this.gameService.emit$().subscribe(event => this.emit(event.playerId, event.eventName, event.data));
  }

  @SubscribeMessage(SocketEventDto.RegisterUser)
  addUser(player: XSocketClient, payload: unknown): void {
    player.name = payload.toString();
    console.log(SocketEventDto.RegisterUser, player.id, player.name);

    this.broadcastFromPlayer(player, SocketEventDto.AddUser, { numUsers: this.getConnectedClientCount() });
    this.emitToWatcher(player, player, SocketEventDto.UserLoginSuccess, { numUsers: this.getConnectedClientCount() });
  }

  @SubscribeMessage(SocketEventDto.StartNewGame)
  startGame(player: XSocketClient, payload: unknown): void {
    console.log(SocketEventDto.StartNewGame, player.id, player.name, JSON.stringify(payload));
    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);

    this.gameService.startPlayerGame(player.id);
  }

  @SubscribeMessage(SocketEventDto.StartWatchingMode)
  startWatching(player: XSocketClient, payload: unknown): void {
    console.log(SocketEventDto.StartWatchingMode, player.id, player.name, JSON.stringify(payload));
    this.gameService.stopPlayerGame(player.id);

    this.watchers = [player.id, ...this.watchers];
  }

  @SubscribeMessage(SocketEventDto.MoveFigure)
  moveFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEventDto.MoveFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEventDto.MoveFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage(SocketEventDto.RotateFigure)
  rotateFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEventDto.RotateFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEventDto.RotateFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage(SocketEventDto.DropFigure)
  dropFigure(player: XSocketClient, payload: unknown): void {
    console.log(SocketEventDto.DropFigure, player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: SocketEventDto.DropFigure,
      data: {payload},
      playerId: player.id,
    });
  }

  public handleConnection<T>(player: XSocketClient, ...args: T[]): void {
    console.log(SocketEventDto.Connect, player.id, player.name, args);
  }

  public handleDisconnect(player: XSocketClient): void {
    console.log(SocketEventDto.Disconnect, player.id, player.name);

    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);
    this.gameService.stopPlayerGame(player.id);

    this.broadcastFromPlayer(player, SocketEventDto.RemoveUser, { numUsers: this.getConnectedClientCount() });
  }

  private getConnectedClientCount(): number {
    return Object.keys(this.server.clients().connected).length;
  }

  private broadcastFromPlayer(player: XSocketClient, eventName: string, data: RecordLike = {}): void {
    this.broadcast(eventName, {
      id: player.id,
      name: player.name,
      ...data,
    })
  }

  private broadcast(eventName: string, data: RecordLike = {}): void {
    this.server.emit(eventName, data);
  }

  private emit(playerId: string, eventName: string, data: RecordLike = {}): void {
    const targetIds = [playerId, ...this.watchers];
    const player: XSocketClient = this.server.clients().connected[playerId];

    targetIds.forEach(targetId => {
      const watcher: XSocketClient = this.server.clients().connected[targetId];

      this.emitToWatcher(watcher, player, eventName, data);
    })
  }

  private emitToWatcher(watcher: XSocketClient, player: XSocketClient, eventName: string, data: RecordLike = {}): void {
    watcher.emit( eventName, {
      id: player.id,
      username: player.name,
      ...data,
    });
  }
}
