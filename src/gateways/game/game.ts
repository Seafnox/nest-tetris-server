import { Type } from '@nestjs/common';
import { CellState } from './cell-state';
import { Direction } from './direction';
import { Figure } from './figures/figure';
import { Line } from './figures/line';
import { Square } from './figures/square';
import { GameState } from './game-state';
import { GameConst } from './game.constants';

export class Game {
    public gameState: GameState;
    public currentFigure: Figure;
    public nextFigure: Figure;
    public score: number;

    private availableFigures: Type<Figure>[] = [
        Square,
        Line,
    ];

    constructor() {
        this.gameState = Array(GameConst.rowsCount).fill(null).map(() => Array(GameConst.colsCount).fill(null).map(() => CellState.EMPTY));
        this.score = 0;
        this.currentFigure = this.getRandomFigure();
        this.nextFigure = this.getRandomFigure();
    }

    public nextTick(): void {
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
        const mapping: Record<CellState, string> = {
            [CellState.EMPTY]: '',
            [CellState.FILLED]: '.',
            [CellState.POINTER]: '.',
        }

        return this.currentFigure.mapToState(this.gameState).map(row => row.map(cell => mapping[cell]));
    }

    private onFigureFall(): void {
        this.gameState = this.currentFigure.dropInState(this.gameState);
        this.currentFigure = this.nextFigure;
        this.nextFigure = this.getRandomFigure();
    }

    private getRandomFigure(): Figure {
        return new this.availableFigures[Math.trunc(Math.random() * this.availableFigures.length)]
    }
}
