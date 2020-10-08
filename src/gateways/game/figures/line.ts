import { CellState } from '../cell-state';
import { Direction } from '../direction';
import { GameState } from '../game-state';
import { GameConst } from '../game.constants';
import { Figure } from './figure';

export class Line extends Figure {
    public isRollable = false;
    public view: GameState = [
        [CellState.FILLED],
        [CellState.FILLED],
        [CellState.POINTER],
        [CellState.FILLED],
    ];

    public mapToState(state: GameState): GameState {
        return state.map((row, posX) => row.map((cellState, posY) => {
            return [this.posX - 1, this.posX, this.posX + 1, this.posX + 2].includes(posX) && [this.posY].includes(posY)
                ? CellState.FILLED
                : cellState
        }));
    }

    public isLastAvailableX(state: GameState): boolean {
        const firstY = this.posY;
        const nextX = this.posX - 2;

        return state[nextX][firstY] === CellState.EMPTY;
    }

    public isLeftMoveAvailable(state: GameState): boolean {
        const allX = [this.posX - 1, this.posX, this.posX + 1, this.posX + 2];
        const nextY = this.posY - 1;

        return nextY > 0 && !allX.some(posX => state[posX][nextY] !== CellState.EMPTY);
    }

    public isRightMoveAvailable(state: GameState): boolean {
        const allX = [this.posX - 1, this.posX, this.posX + 1, this.posX + 2];
        const nextY = this.posY + 1;

        return nextY < GameConst.colsCount && !allX.some(posX => state[posX][nextY] !== CellState.EMPTY);
    }

    public onRoll(state: GameState, direction: Direction): void {
        throw new Error(`${this.constructor.name} cannot rolling`);
    }
}
