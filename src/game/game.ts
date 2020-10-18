import { Type } from '@nestjs/common';
import { GameState } from '../interfaces/game-state';
import { CellState } from './cell-state';
import { Direction } from './direction';
import { Figure } from './figures/figure';
import { Line } from './figures/line';
import { Square } from './figures/square';
import { gameViewMap } from './game-view-map';
import { GameConst } from './game.constants';

export class Game {
    public gameState: GameState;
    public currentFigure: Figure;
    public nextFigure: Figure;
    public isGameOver: boolean;
    public isScoreIncremented: boolean;
    public isLvlUp: boolean;
    public isFigureFall: boolean;
    public score: number;
    public level: number;
    private nextLevelScore: number;

    private availableFigures: Type<Figure>[] = [
        Square,
        Line,
    ];

    constructor() {
        this.gameState = Array(GameConst.rowsCount).fill(null).map(this.generateRow.bind(this));
        this.isGameOver = false;
        this.isScoreIncremented = false;
        this.isLvlUp = false;
        this.isFigureFall = false;
        this.score = 0;
        this.level = 1;
        this.nextLevelScore = 1;
        this.currentFigure = this.getRandomFigure();
        this.currentFigure.onFirstStep();

        this.nextFigure = this.getRandomFigure();
    }

    public nextTick(): void {
        this.isScoreIncremented = false;
        this.isLvlUp = false;
        this.isFigureFall = false;

        this.handleFilledRows();

        this.currentFigure.isDownMoveAvailable(this.gameState)
            ? this.currentFigure.onMove(this.gameState, Direction.DOWN)
            : this.onFigureFall();
    }

    public onMove(direction: Direction): void {
        this.currentFigure.onMove(this.gameState, direction);
    }

    public onRotate(direction: Direction): void {
        this.currentFigure.onRotate(this.gameState, direction);
    }

    public onDrop(): void {
        this.currentFigure.dropInState(this.gameState);
    }

    public getStateView(): string[][] {
        return this.currentFigure.mapToState(this.gameState).map(row => row.map(cell => gameViewMap[cell])).reverse();
    }

    private generateRow(): CellState[] {
        return Array(GameConst.colsCount).fill(null).map(this.generateCell.bind(this))
    }

    private generateCell(): CellState {
        return CellState.EMPTY;
    }

    private onFigureFall(): void {
        this.gameState = this.currentFigure.dropInState(this.gameState);
        this.isFigureFall = true;
        this.currentFigure = this.nextFigure;
        this.nextFigure = this.getRandomFigure();

        this.currentFigure.isDownMoveAvailable(this.gameState)
            ? this.currentFigure.onFirstStep()
            : this.isGameOver = true;
    }

    private getRandomFigure(): Figure {
        return new this.availableFigures[Math.trunc(Math.random() * this.availableFigures.length)]
    }

    private handleFilledRows(): void {
        if (!this.hasFilledRows()) {
            return;
        }

        const newState = this.gameState.filter(row => !this.isRowFilled(row));
        const filledRowCount = GameConst.rowsCount - newState.length;
        this.isScoreIncremented = true;
        this.score = this.score + filledRowCount * this.level;

        if (this.score >= this.nextLevelScore) {
            this.isLvlUp = true;
            this.level = this.level + 1;
            this.nextLevelScore = this.nextLevelScore * 2;
        }

        this.gameState = this.stabilizeState(newState);
    }

    private stabilizeState(state: GameState): GameState {
        for(let i = 0; i < GameConst.rowsCount; i++) {
            if (!state[i]) {
                state[i] = this.generateRow();
            }
        }

        return state;
    }

    private hasFilledRows(): boolean {
        return this.gameState.some(this.isRowFilled);
    }

    private isRowFilled(row: CellState[]): boolean {
        return !row.some(cell => cell === CellState.EMPTY);
    }
}
