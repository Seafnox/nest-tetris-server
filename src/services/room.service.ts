import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { RoomBridgeEvent } from '../interfaces/room-bridge-event';
import { RoomState } from '../interfaces/room-state';
import { GameService } from './game.service';

@Injectable()
export class RoomService {
    private rooms: Record<string, RoomState> = {};

    private emitter$ = new Subject<RoomBridgeEvent>();

    constructor(private gameService: GameService) {
        this.gameService.emit$().subscribe(event => this.emit(event.playerId, event.eventName, event.data));
    }

    public emit$(): Observable<RoomBridgeEvent> {
        return this.emitter$.asObservable();
    }

    public findFreeRoom(): string {
        const existedFreeRoomId = Object.keys(this.rooms).find(this.isFreePlaceInRoom);

        return !!existedFreeRoomId ? existedFreeRoomId : this.createNewRoom();
    }

    public registerPlayerInRoom(playerId: string, roomId: string): void {
        if (!this.isFreePlaceInRoom(roomId)) {
            throw new Error(`Can't set player '${playerId}' in room '${roomId}'. Room already full`);
        }

        const room = this.rooms[roomId];
        if (!room.playerOne) {
            room.playerOne = playerId;
            this.startGamesIfAllPlayersInRoom(roomId);

            return;
        }

        if (!room.playerTwo) {
            room.playerTwo = playerId;
            this.startGamesIfAllPlayersInRoom(roomId);

            return;
        }
    }

    public unregisterPlayer(playerId: string): void {
        const room = this.rooms[this.findPlayerRoomId(playerId)];
        this.gameService.stopPlayerGame(room.playerOne);
        this.gameService.stopPlayerGame(room.playerTwo);

        if (room.playerOne === playerId) {
            room.playerOne = undefined;

            return;
        }

        if (room.playerTwo === playerId) {
            room.playerTwo = undefined;

            return;
        }
    }

    public isFreePlaceInRoom(roomId: string): boolean {
        const room = this.rooms[roomId];

        return !room.playerTwo || !room.playerOne;
    }

    private startGamesIfAllPlayersInRoom(roomId: string): void {
        const room = this.rooms[roomId];

        if (!!room.playerOne && !!room.playerTwo) {
            this.gameService.startPlayerGame(room.playerOne);
            this.gameService.startPlayerGame(room.playerTwo);
        }
    }

    private emit(initiatorId: string, eventName: string, data: object): void {
        const receiverId = this.findOpponent(initiatorId);
        this.emitter$.next({ receiverId: initiatorId, initiatorId, eventName, data });
        if (receiverId) {
            this.emitter$.next({ receiverId, initiatorId, eventName, data });
        }
    }

    private findOpponent(playerId: string): string {
        const { playerOne, playerTwo } = this.rooms[this.findPlayerRoomId(playerId)];

        return playerOne === playerId ? playerTwo : playerOne;
    }

    private findPlayerRoomId(playerId: string): string {
        return Object.keys(this.rooms).find(roomId => {
            const { playerOne, playerTwo } = this.rooms[roomId];

            return playerOne === playerId || playerTwo === playerId;
        })
    }

    private createNewRoom(): string {
        const key = `room_${Object.keys(this.rooms).length}${Math.trunc(Math.random()*1000).toString(36)}`;
        this.rooms[key] = { playerOne: undefined, playerTwo: undefined };

        return key;
    }
}
