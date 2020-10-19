import { CellState } from '../cell-state';
import { GameState } from '../../interfaces/game-state';
import { Figure } from './figure';

export class LFigure extends Figure {
    public getViews(): GameState[] {
        return [
            [
                [CellState.FILLED, CellState.POINTER, CellState.FILLED],
                [CellState.FILLED, CellState.EMPTY, CellState.EMPTY],
            ],
            [
                [CellState.FILLED, CellState.FILLED],
                [CellState.EMPTY, CellState.POINTER],
                [CellState.EMPTY, CellState.FILLED],
            ],
            [
                [CellState.EMPTY, CellState.EMPTY, CellState.FILLED],
                [CellState.FILLED, CellState.POINTER, CellState.FILLED],
            ],
            [
                [CellState.FILLED, CellState.EMPTY],
                [CellState.POINTER, CellState.EMPTY],
                [CellState.FILLED, CellState.FILLED],
            ],
        ];
    }
}
