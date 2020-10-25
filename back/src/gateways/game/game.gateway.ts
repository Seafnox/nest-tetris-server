import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
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

  @SubscribeMessage('add user')
  addUser(player: XSocketClient, payload: unknown): void {
    player.name = payload.toString();
    console.log('addUser', player.id, player.name);

    this.broadcastFromPlayer(player, 'user joined', { numUsers: this.getConnectedClientCount() });
    this.emitToWatcher(player, player, 'login', { numUsers: this.getConnectedClientCount() });
  }

  @SubscribeMessage('startGame')
  startGame(player: XSocketClient, payload: unknown): void {
    console.log('startGame', player.id, player.name, JSON.stringify(payload));
    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);

    this.gameService.startPlayerGame(player.id);
  }

  @SubscribeMessage('startWatching')
  startWatching(player: XSocketClient, payload: unknown): void {
    console.log('startWatching', player.id, player.name, JSON.stringify(payload));
    this.gameService.stopPlayerGame(player.id);

    this.watchers = [player.id, ...this.watchers];
  }

  @SubscribeMessage('moveFigure')
  moveFigure(player: XSocketClient, payload: unknown): void {
    console.log('moveFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'moveFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage('rotateFigure')
  rotateFigure(player: XSocketClient, payload: unknown): void {
    console.log('rotateFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'rotateFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage('dropFigure')
  dropFigure(player: XSocketClient, payload: unknown): void {
    console.log('dropFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'dropFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  public handleConnection<T>(player: XSocketClient, ...args: T[]): void {
    console.log('connected', player.id, player.name, args);
  }

  public handleDisconnect(player: XSocketClient): void {
    console.log('disconnected', player.id, player.name);

    this.watchers = this.watchers.filter(watcherId => watcherId !== player.id);
    this.gameService.stopPlayerGame(player.id);

    this.broadcastFromPlayer(player,'user left', { numUsers: this.getConnectedClientCount() });
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
