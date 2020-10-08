import { CellState } from '../cell-state';
import { Direction } from '../direction';
import { GameState } from '../game-state';
import { GameConst } from '../game.constants';
import { Figure } from './figure';

export class Square extends Figure {
    public isRollable = false;
    public view: GameState = [
        [CellState.FILLED, CellState.FILLED],
        [CellState.FILLED, CellState.POINTER],
    ];

    public mapToState(state: GameState): GameState {
        return state.map((row, posX) => row.map((cellState, posY) => {
            return [this.posX, this.posX + 1].includes(posX) && [this.posY, this.posY - 1].includes(posY)
                ? CellState.FILLED
                : cellState
        }));
    }

    public hasClearFloor(state: GameState): boolean {
        const firstY = this.posY - 1;
        const secondY = this.posY;
        const nextX = this.posX - 1;

        return nextX >= 0 && state[nextX][firstY] === CellState.EMPTY && state[nextX][secondY] === CellState.EMPTY;
    }

    public isLeftMoveAvailable(state: GameState): boolean {
        const firstX = this.posX + 1;
        const secondX = this.posX;
        const nextY = this.posY - 2;

        return nextY > 0 && state[firstX][nextY] === CellState.EMPTY && state[secondX][nextY] === CellState.EMPTY;
    }

    public isRightMoveAvailable(state: GameState): boolean {
        const firstX = this.posX + 1;
        const secondX = this.posX;
        const nextY = this.posY + 1;

        return nextY < GameConst.colsCount && state[firstX][nextY] === CellState.EMPTY && state[secondX][nextY] === CellState.EMPTY;
    }

    public onRoll(state: GameState, direction: Direction): void {
        throw new Error(`${this.constructor.name} cannot rolling`);
    }
}
