import { Injectable } from '@nestjs/common';
import { interval, Observable, Subject, Subscription } from 'rxjs';
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
    }

    private nextGameTick(clientId: string): void {
        const game = this.games[clientId];

        if (!game.isGameOver) {
            game.nextTick();

            this.emit(clientId, 'newGameState', { state: game.getStateView() });
            this.emit(clientId, 'newScore', { value: game.score});
        }

        if (game.isFigureFall) {
            this.emit(clientId, 'newNextItem', { item: game.nextFigure.getStateView() });
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
