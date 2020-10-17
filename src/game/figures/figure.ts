import { noop } from 'rxjs';
import { GameState } from '../../interfaces/game-state';
import { CellState } from '../cell-state';
import { Direction } from '../direction';
import { gameViewMap } from '../game-view-map';
import { GameConst } from '../game.constants';

export abstract class Figure {
    public abstract isRollable: boolean;
    public abstract view: GameState;

    public posX = GameConst.rowsCount + this.getInitialOffset();
    public posY = Math.round(GameConst.colsCount / 2);
    public name = this.constructor.name;

    public abstract getInitialOffset(): number;

    public abstract mapToState(state: GameState): GameState;

    public abstract hasClearFloor(state: GameState): boolean;

    public abstract isLeftMoveAvailable(state: GameState): boolean;

    public abstract isRightMoveAvailable(state: GameState): boolean;

    public abstract onRotate(state: GameState, direction: Direction): void;

    public getStateView(): string[][] {
        return this.view.map(row => row.map(cell => gameViewMap[cell]));
    }

    public onFirstStep(): void {
        this.posX = this.posX - this.getInitialOffset();
    }

    public dropInState(state: GameState): GameState {
        while(this.hasClearFloor(state)) {
            this.moveDown();
        }

        console.log('dropInState', this.posX, this.posY, this.name);

        return this.mapToState(state);
    }

    public onMove(state: GameState, direction: Direction): void {
        console.log('onMove', direction, this.isLeftMoveAvailable(state));
        switch (direction) {
            case Direction.LEFT: {
                console.log('onMove', direction, this.isLeftMoveAvailable(state));
                return this.isLeftMoveAvailable(state) ? this.moveLeft() : noop();
            }
            case Direction.RIGHT: {
                console.log('onMove', direction, this.isLeftMoveAvailable(state));
                return this.isRightMoveAvailable(state) ? this.moveRight() : noop();
            }
            case Direction.DOWN: return this.hasClearFloor(state) ? this.moveDown() : noop();
        }
    }

    protected moveLeft(): void {
        console.log(`${this.constructor.name} move left`);
        this.posY = this.posY - 1;
    }

    protected moveRight(): void {
        console.log(`${this.constructor.name} move right`);
        this.posY = this.posY + 1;
    }

    protected moveDown(): void {
        this.posX = this.posX - 1;
    }

    getCellState(state: GameState, posX: number, posY: number): CellState {
        if (posX >= GameConst.rowsCount && posY >= 0 && posY < GameConst.colsCount) {
            return CellState.EMPTY;
        }

        return state?.[posX]?.[posY] ?? CellState.FILLED;
    }

    isCellStateEmpty(state: GameState, posX: number, posY: number): boolean {
        return this.getCellState(state, posX, posY) === CellState.EMPTY;
    }
}
