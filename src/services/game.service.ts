import { Injectable } from '@nestjs/common';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { Direction } from '../game/direction';
import { Game } from '../game/game';
import { GameBridgeEvent } from '../interfaces/game-bridge-event';

@Injectable()
export class GameService {
    private subscriptions: Record<string, Subscription> = {};
    private games: Record<string, Game> = {};

    private emitter$ = new Subject<GameBridgeEvent>();

    public emit$(): Observable<GameBridgeEvent> {
        return this.emitter$.asObservable();
    }

    public userAction(event: GameBridgeEvent): void {
        const userActionMap: Record<string, (clientId: string, data: object) => void> = {
            moveFigure: this.onMoveFigure.bind(this),
            rotateFigure: this.onRotateFigure.bind(this),
            dropFigure: this.onDropFigure.bind(this),
        }

        const handler = userActionMap[event.eventName];

        if (!handler) {
            throw new Error(`Cannot find handler for event: ${JSON.stringify(event)}`);
        }

        handler(event.clientId, event.data);
    }

    public startClientGame(clientId: string): void {
        const game = new Game();

        this.emitGameState(clientId, game);
        this.emitScore(clientId, game);
        this.emitNextItem(clientId, game);
        this.emitLvl(clientId, game);

        this.games[clientId] = game;

        this.restartGameSubscription(1000, clientId);
    }

    public stopClientGame(clientId: string): void {
        this.dropPreviousGameSubscription(clientId);
        this.dropPreviousGame(clientId);
    }

    private onMoveFigure(clientId: string, data: { payload: string}): void {
        const game = this.getGame(clientId);
        game.onMove(this.getDirection(data.payload));

        this.emit(clientId, 'newGameState', { state: game.getStateView() });
    }

    private onRotateFigure(clientId: string, data: { payload: string}): void {
        const game = this.getGame(clientId);
        game.onRotate(this.getDirection(data.payload));

        this.emit(clientId, 'newGameState', { state: game.getStateView() });
    }

    private onDropFigure(clientId: string): void {
        const game = this.getGame(clientId);
        game.onDrop();

        this.emit(clientId, 'newGameState', { state: game.getStateView() });
    }

    private getDirection(directionStr: string): Direction {
        switch (directionStr) {
            case 'left': return Direction.LEFT;
            case 'right': return Direction.RIGHT;
            case 'down': return Direction.DOWN;
            default: throw new Error(`Unknwn direction: ${directionStr}`);
        }
    }

    private getGame(clientId: string): Game {
        if (!this.games[clientId]) {
            throw new Error(`Cannot find game for client: ${clientId}`);
        }

        return this.games[clientId];
    }

    private nextGameTick(clientId: string): void {
        const game = this.games[clientId];

        if (!game.isGameOver) {
            game.nextTick();

            this.emitGameState(clientId, game);

            if (game.isScoreIncremented) {
                this.emitScore(clientId, game);
            }

            if (game.isFigureFall) {
                this.emitNextItem(clientId, game);
            }

            if (game.isLvlUp) {
                this.emitLvl(clientId, game);
                this.restartGameSubscription(1000 - game.level*50, clientId);
            }
        }
    }

    private emit(clientId: string, eventName: string, data: object): void {
        this.emitter$.next({ clientId, eventName, data });
    }

    private emitGameState(clientId: string, game: Game): void {
        this.emit(clientId, 'newGameState', { state: game.getStateView() });
    }

    private emitScore(clientId: string, game: Game): void {
        this.emit(clientId, 'newScore', { value: game.score});
    }

    private emitLvl(clientId: string, game: Game): void {
        this.emit(clientId, 'newLvl', { value: game.level});
    }

    private emitNextItem(clientId: string, game: Game): void {
        this.emit(clientId, 'newNextItem', { item: game.nextFigure.getStateView() });
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

    private restartGameSubscription(timeout: number, clientId: string): void {
        const realTimeout = timeout >= 10 ? timeout : 10;
        this.dropPreviousGameSubscription(clientId);
        this.subscriptions[clientId] = interval(realTimeout).subscribe(() => this.nextGameTick(clientId));
    }
}
