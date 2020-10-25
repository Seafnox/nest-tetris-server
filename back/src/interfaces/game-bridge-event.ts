import { RecordLike } from './record-like';

export interface GameBridgeEvent {
    playerId: string,
    eventName: string,
    data: RecordLike,
}
