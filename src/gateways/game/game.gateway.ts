import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { XSocketClient } from './x-socket-client';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private clientIds: string[] = [];

  @SubscribeMessage('add user')
  addUser(client: XSocketClient, payload: any): WsResponse {
    client.name = payload.toString();

    console.log('addUser', client.id, client.name);

    this.server.emit('user joined', {
      id: client.id,
      username: client.name,
      numUsers: this.clientIds.length,
    });

    return {
      event: 'login',
      data: {
        id: client.id,
        username: client.name,
        numUsers: this.clientIds.length,
      }
    }
  }

  @SubscribeMessage('new message')
  newMessage(client: XSocketClient, payload: any): void {
    console.log('newMessage', client.id, client.name, JSON.stringify(payload));
    this.server.emit('new message', {
      id: client.id,
      username: client.name,
      message: payload.toString(),
      typing: false,
    });
  }

  @SubscribeMessage('typing')
  typing(client: XSocketClient, payload: any): void {
    console.log('typing', client.id, client.name, JSON.stringify(payload));
    this.server.emit('typing', {
      id: client.id,
      username: client.name,
      message: payload.toString(),
      typing: true,
    });
  }

  @SubscribeMessage('stop typing')
  stopTyping(client: XSocketClient, payload: any): void {
    console.log('stop typing', client.id, client.name, JSON.stringify(payload));
    this.server.emit('stop typing', {
      id: client.id,
      username: client.name,
      data: payload.toString(),
    });
  }

  public handleConnection(client: XSocketClient, ...args: any[]): any {
    this.clientIds.push(client.id);
    console.log('connected', client.id, client.name, args);
  }

  public handleDisconnect(client: XSocketClient): any {
    this.clientIds.filter(clientId => clientId !== client.id);

    console.log('disconnected', client.id, client.name);

    this.server.emit('user left', {
      id: client.id,
      username: client.name,
      numUsers: this.clientIds.length,
    });
  }
}
