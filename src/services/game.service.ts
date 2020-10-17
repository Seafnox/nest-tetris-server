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
        console.log('userAction', event);
        const userActionMap: Record<string, (clientId: string, data: object) => void> = {
            moveFigure: this.onMoveFigure.bind(this),
            rotateFigure: this.onRotateFigure.bind(this),
            dropFigure: this.onDropFigure.bind(this),
        }

        const handler = userActionMap[event.eventName];

        if (!handler) {
            throw new Error(`Cannot fild handler for event: ${JSON.stringify(event)}`);
        }

        handler(event.clientId, event.data);
    }

    public startClientGame(clientId: string): void {
        const game = new Game();

        this.emit(clientId, 'newGameState', { state: game.getStateView() });
        this.emit(clientId, 'newNextItem', { item: game.nextFigure.getStateView() });
        this.games[clientId] = game;
        this.subscriptions[clientId] = interval(1000).subscribe(() => this.nextGameTick(clientId));
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

            this.emit(clientId, 'newGameState', { state: game.getStateView() });
            this.emit(clientId, 'newScore', { value: game.score});

            if (game.isFigureFall) {
                this.emit(clientId, 'newNextItem', { item: game.nextFigure.getStateView() });
            }
        }
    }

    private emit(clientId: string, eventName: string, data: object): void {
        this.emitter$.next({ clientId, eventName, data });
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
}
