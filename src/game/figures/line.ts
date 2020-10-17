import { CellState } from '../cell-state';
import { Direction } from '../direction';
import { GameState } from '../../interfaces/game-state';
import { GameConst } from '../game.constants';
import { Figure } from './figure';

export class Line extends Figure {
    public isRollable = false;
    public view: GameState = [
        [CellState.EMPTY, CellState.FILLED, CellState.EMPTY],
        [CellState.EMPTY, CellState.FILLED, CellState.EMPTY],
        [CellState.EMPTY, CellState.POINTER, CellState.EMPTY],
        [CellState.EMPTY, CellState.FILLED, CellState.EMPTY],
    ];

    public mapToState(state: GameState): GameState {
        return state.map((row, posX) => row.map((cellState, posY) => {
            return [this.posX - 1, this.posX, this.posX + 1, this.posX + 2].includes(posX) && [this.posY].includes(posY)
                ? CellState.FILLED
                : cellState
        }));
    }

    public hasClearFloor(state: GameState): boolean {
        const firstY = this.posY;
        const nextX = this.posX - 2;

        return nextX >= 0 && this.isCellStateEmpty(state, nextX, firstY);
    }

    public isLeftMoveAvailable(state: GameState): boolean {
        const allX = [this.posX - 1, this.posX, this.posX + 1, this.posX + 2];
        const nextY = this.posY - 1;
        const result = nextY >= 0 && !allX.some(posX => !this.isCellStateEmpty(state, posX, nextY));

        return result
    }

    public isRightMoveAvailable(state: GameState): boolean {
        const allX = [this.posX - 1, this.posX, this.posX + 1, this.posX + 2];
        const nextY = this.posY + 1;

        const result = nextY < GameConst.colsCount && !allX.some(posX => !this.isCellStateEmpty(state, posX, nextY));

        return result
    }

    public onRotate(state: GameState, direction: Direction): void {
        throw new Error(`${this.constructor.name} cannot rolling`);
    }

    public getInitialOffset(): number {
        return 1;
    }
}
