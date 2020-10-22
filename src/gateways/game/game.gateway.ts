import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from '../../services/game.service';
import { XSocketClient } from '../../interfaces/x-socket-client';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private gameService: GameService) {
    this.gameService.emit$().subscribe(event => this.emit(event.playerId, event.eventName, event.data));
  }

  @SubscribeMessage('add user')
  addUser(player: XSocketClient, payload: any): void {
    player.name = payload.toString();
    console.log('addUser', player.id, player.name);

    this.broadcastFromClient(player, 'user joined', { numUsers: this.getConnectedClientCount() });
    this.emitToPlayer(player, 'login', { numUsers: this.getConnectedClientCount() });
  }

  @SubscribeMessage('startGame')
  startGame(player: XSocketClient, payload: any): void {
    console.log('startGame', player.id, player.name, JSON.stringify(payload));
    this.gameService.startPlayerGame(player.id);
  }

  @SubscribeMessage('moveFigure')
  moveFigure(player: XSocketClient, payload: any): void {
    console.log('moveFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'moveFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage('rotateFigure')
  rotateFigure(player: XSocketClient, payload: any): void {
    console.log('rotateFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'rotateFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage('dropFigure')
  dropFigure(player: XSocketClient, payload: any): void {
    console.log('dropFigure', player.id, player.name, JSON.stringify(payload));
    this.gameService.userAction({
      eventName: 'dropFigure',
      data: {payload},
      playerId: player.id,
    });
  }

  @SubscribeMessage('new message')
  newMessage(player: XSocketClient, payload: any): void {
    console.log('newMessage', player.id, player.name, JSON.stringify(payload));
    this.broadcastFromClient(player, 'new message', { message: payload.toString(), typing: false });
  }

  @SubscribeMessage('typing')
  typing(player: XSocketClient): void {
    console.log('typing', player.id, player.name);
    this.broadcastFromClient(player, 'typing');
  }

  @SubscribeMessage('stop typing')
  stopTyping(player: XSocketClient): void {
    console.log('stop typing', player.id, player.name);
    this.broadcastFromClient(player,'stop typing');
  }

  public handleConnection(player: XSocketClient, ...args: any[]): any {
    console.log('connected', player.id, player.name, args);
  }

  public handleDisconnect(player: XSocketClient): any {
    console.log('disconnected', player.id, player.name);

    this.gameService.stopPlayerGame(player.id);

    this.broadcastFromClient(player,'user left', { numUsers: this.getConnectedClientCount() });
  }

  private getConnectedClientCount(): number {
    return Object.keys(this.server.clients().connected).length;
  }

  private broadcastFromClient(player: XSocketClient, eventName: string, data: object = {}): void {
    this.broadcast(eventName, {
      id: player.id,
      name: player.name,
      ...data,
    })
  }

  private broadcast(eventName: string, data: object = {}): void {
    this.server.emit(eventName, data);
  }

  private emit(playerId: string, eventName: string, data: object = {}): void {
    const player: XSocketClient = this.server.clients().connected[playerId];

    this.emitToPlayer(player, eventName, data);
  }

  private emitToPlayer(player: XSocketClient, eventName: string, data: object = {}): void {
    player.emit( eventName, {
      id: player.id,
      username: player.name,
      ...data,
    });
  }
}
