import { Injectable } from '@nestjs/common';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { DirectionDto } from '~tetris/dto/direction-dto';
import { Direction } from '../game/direction';
import { Game } from '../game/game';
import { GameBridgeEvent } from '../interfaces/game-bridge-event';
import { RecordLike } from '../interfaces/record-like';

@Injectable()
export class GameService {
    private subscriptions: Record<string, Subscription> = {};

    private games: Record<string, Game> = {};

    private emitter$ = new Subject<GameBridgeEvent>();

    public emit$(): Observable<GameBridgeEvent> {
        return this.emitter$.asObservable();
    }

    public userAction(event: GameBridgeEvent): void {
        const userActionMap: Record<string, (playerId: string, data: RecordLike) => void> = {
            moveFigure: this.onMoveFigure.bind(this),
            rotateFigure: this.onRotateFigure.bind(this),
            dropFigure: this.onDropFigure.bind(this),
        }

        const handler = userActionMap[event.eventName];

        if (!handler) {
            throw new Error(`Cannot find handler for event: ${JSON.stringify(event)}`);
        }

        handler(event.playerId, event.data);
    }

    public startPlayerGame(playerId: string): void {
        const game = new Game();

        this.emitGameState(playerId, game);
        this.emitScore(playerId, game);
        this.emitNextItem(playerId, game);
        this.emitLvl(playerId, game);

        this.games[playerId] = game;

        this.restartGameSubscription(1000, playerId);
    }

    public stopPlayerGame(playerId: string): void {
        this.dropPreviousGameSubscription(playerId);
        this.dropPreviousGame(playerId);
    }

    private onMoveFigure(playerId: string, data: { payload: string}): void {
        const game = this.getGame(playerId);
        game.onMove(this.getDirection(data.payload));

        this.emit(playerId, 'newGameState', { state: game.getStateView() });
    }

    private onRotateFigure(playerId: string, data: { payload: string}): void {
        const game = this.getGame(playerId);
        game.onRotate(this.getDirection(data.payload));

        this.emit(playerId, 'newGameState', { state: game.getStateView() });
    }

    private onDropFigure(playerId: string): void {
        const game = this.getGame(playerId);
        game.onDrop();

        this.emit(playerId, 'newGameState', { state: game.getStateView() });
    }

    private getDirection(directionStr: string): Direction {
        switch (directionStr) {
            case DirectionDto.LEFT: return Direction.LEFT;
            case DirectionDto.RIGHT: return Direction.RIGHT;
            case DirectionDto.DOWN: return Direction.DOWN;
            default: throw new Error(`Unknown direction: ${directionStr}`);
        }
    }

    private getGame(playerId: string): Game {
        if (!this.games[playerId]) {
            throw new Error(`Cannot find game for player: ${playerId}`);
        }

        return this.games[playerId];
    }

    private nextGameTick(playerId: string): void {
        const game = this.games[playerId];

        if (!game.isGameOver) {
            game.nextTick();

            this.emitGameState(playerId, game);

            if (game.isScoreIncremented) {
                this.emitScore(playerId, game);
            }

            if (game.isFigureFall) {
                this.emitNextItem(playerId, game);
            }

            if (game.isLvlUp) {
                this.emitLvl(playerId, game);
                this.restartGameSubscription(1000 - game.level*50, playerId);
            }
        }
    }

    private emit(playerId: string, eventName: string, data: RecordLike): void {
        this.emitter$.next({ playerId, eventName, data });
    }

    private emitGameState(playerId: string, game: Game): void {
        this.emit(playerId, 'newGameState', { state: game.getStateView() });
    }

    private emitScore(playerId: string, game: Game): void {
        this.emit(playerId, 'newScore', { value: game.score});
    }

    private emitLvl(playerId: string, game: Game): void {
        this.emit(playerId, 'newLvl', { value: game.level});
    }

    private emitNextItem(playerId: string, game: Game): void {
        this.emit(playerId, 'newNextItem', { item: game.nextFigure.getStateView() });
    }

    private dropPreviousGame(token: string): void {
        if (!this.games[token]) {
            return;
        }

        delete this.games[token];
    }

    private dropPreviousGameSubscription(token: string): void {
        if (!this.subscriptions[token]) {
            return;
        }

        this.subscriptions[token].unsubscribe();

        delete this.subscriptions[token];
    }

    private restartGameSubscription(timeout: number, playerId: string): void {
        const realTimeout = timeout >= 10 ? timeout : 10;
        this.dropPreviousGameSubscription(playerId);
        this.subscriptions[playerId] = interval(realTimeout).subscribe(() => this.nextGameTick(playerId));
    }
}
