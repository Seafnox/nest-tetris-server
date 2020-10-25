import { Socket } from 'socket.io';

export interface XSocketClient extends Socket {
    name?: string;
}
