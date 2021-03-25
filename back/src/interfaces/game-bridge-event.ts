import { SocketEvent } from '~tetris/dto/socket-event';
import { RecordLike } from './record-like';

export interface GameBridgeEvent {
    playerId: string,
    eventName: SocketEvent,
    data: RecordLike,
}
