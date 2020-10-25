import { CellState } from '../cell-state';
import { GameState } from '../../interfaces/game-state';
import { Figure } from './figure';

export class ZFigure extends Figure {
    public getViews(): GameState[] {
        return [
            [
                [CellState.FILLED, CellState.POINTER, CellState.EMPTY],
                [CellState.EMPTY, CellState.FILLED, CellState.FILLED],
            ],
            [
                [CellState.EMPTY, CellState.FILLED],
                [CellState.POINTER, CellState.FILLED],
                [CellState.FILLED, CellState.EMPTY],
            ],
        ];
    }
}
