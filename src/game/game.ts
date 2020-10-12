import { Type } from '@nestjs/common';
import { CellState } from './cell-state';
import { Direction } from './direction';
import { Figure } from './figures/figure';
import { Line } from './figures/line';
import { Square } from './figures/square';
import { GameState } from '../interfaces/game-state';
import { gameViewMap } from './game-view-map';
import { GameConst } from './game.constants';

export class Game {
    public gameState: GameState;
    public currentFigure: Figure;
    public nextFigure: Figure;
    public isGameOver: boolean;
    public isFigureFall: boolean;
    public score: number;

    private availableFigures: Type<Figure>[] = [
        Square,
        Line,
    ];

    constructor() {
        this.gameState = Array(GameConst.rowsCount).fill(null).map(() => Array(GameConst.colsCount).fill(null).map(() => CellState.EMPTY));
        this.isGameOver = false;
        this.isFigureFall = false;
        this.score = 0;
        this.currentFigure = this.getRandomFigure();
        this.currentFigure.onFirstStep();

        this.nextFigure = this.getRandomFigure();
    }

    public nextTick(): void {
        this.isFigureFall = false;

        this.currentFigure.hasClearFloor(this.gameState)
            ? this.currentFigure.onMove(this.gameState, Direction.DOWN)
            : this.onFigureFall();
    }

    public onMove(direction: Direction): void {
        this.currentFigure.onMove(this.gameState, direction);
    }

    public onRoll(direction: Direction): void {
        if (!this.currentFigure.isRollable) {
            return;
        }

        this.currentFigure.onRoll(this.gameState, direction);
    }

    public getStateView(): string[][] {
        return this.currentFigure.mapToState(this.gameState).map(row => row.map(cell => gameViewMap[cell]));
    }

    private onFigureFall(): void {
        this.gameState = this.currentFigure.dropInState(this.gameState);
        this.isFigureFall = true;
        this.currentFigure = this.nextFigure;
        this.nextFigure = this.getRandomFigure();

        this.currentFigure.hasClearFloor(this.gameState)
            ? this.currentFigure.onFirstStep()
            : this.isGameOver = true;
    }

    private getRandomFigure(): Figure {
        return new this.availableFigures[Math.trunc(Math.random() * this.availableFigures.length)]
    }
}
