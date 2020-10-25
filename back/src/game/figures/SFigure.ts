import { CellState } from '../cell-state';
import { GameState } from '../../interfaces/game-state';
import { Figure } from './figure';

export class SFigure extends Figure {
    public getViews(): GameState[] {
        return [
            [
                [CellState.EMPTY, CellState.POINTER, CellState.FILLED],
                [CellState.FILLED, CellState.FILLED, CellState.EMPTY],
            ],
            [
                [CellState.FILLED, CellState.EMPTY],
                [CellState.POINTER, CellState.FILLED],
                [CellState.EMPTY, CellState.FILLED],
            ],
        ];
    }
}
