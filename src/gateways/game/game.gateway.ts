import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from '../../services/game.service';
import { XSocketClient } from '../../interfaces/x-socket-client';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private gameService: GameService) {
    this.gameService.emit$().subscribe(event => this.emit(event.clientId, event.eventName, event.data));
  }

  @SubscribeMessage('add user')
  addUser(client: XSocketClient, payload: any): void {
    client.name = payload.toString();
    console.log('addUser', client.id, client.name);

    this.broadcastFromClient(client, 'user joined', { numUsers: this.getConnectedClientCount() });
    this.emitToClient(client, 'login', { numUsers: this.getConnectedClientCount() });
  }
  @SubscribeMessage('startGame')
  startGame(client: XSocketClient, payload: any): void {
    console.log('startGame', client.id, client.name, JSON.stringify(payload));
    this.gameService.startClientGame(client.id);
  }

  @SubscribeMessage('new message')
  newMessage(client: XSocketClient, payload: any): void {
    console.log('newMessage', client.id, client.name, JSON.stringify(payload));
    this.broadcastFromClient(client, 'new message', { message: payload.toString(), typing: false });
  }

  @SubscribeMessage('typing')
  typing(client: XSocketClient): void {
    console.log('typing', client.id, client.name);
    this.broadcastFromClient(client, 'typing');
  }

  @SubscribeMessage('stop typing')
  stopTyping(client: XSocketClient): void {
    console.log('stop typing', client.id, client.name);
    this.broadcastFromClient(client,'stop typing');
  }

  public handleConnection(client: XSocketClient, ...args: any[]): any {
    console.log('connected', client.id, client.name, args);
  }

  public handleDisconnect(client: XSocketClient): any {
    console.log('disconnected', client.id, client.name);

    this.gameService.stopClientGame(client.id);

    this.broadcastFromClient(client,'user left', { numUsers: this.getConnectedClientCount() });
  }

  private getConnectedClientCount(): number {
    return Object.keys(this.server.clients().connected).length;
  }

  private broadcastFromClient(client: XSocketClient, eventName: string, data: object = {}): void {
    this.broadcast(eventName, {
      id: client.id,
      name: client.name,
      ...data,
    })
  }

  private broadcast(eventName: string, data: object = {}): void {
    this.server.emit(eventName, data);
  }

  private emit(clientId: string, eventName: string, data: object = {}): void {
    const client: XSocketClient = this.server.clients().connected[clientId];

    this.emitToClient(client, eventName, data);
  }

  private emitToClient(client: XSocketClient, eventName: string, data: object = {}): void {
    client.emit( eventName, {
      id: client.id,
      username: client.name,
      ...data,
    });
  }
}
