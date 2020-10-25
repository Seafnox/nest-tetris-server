import { CellState } from '../cell-state';
import { GameState } from '../../interfaces/game-state';
import { Figure } from './figure';

export class IFigure extends Figure {
    public getViews(): GameState[] {
        return [
            // vertical
            [[CellState.FILLED], [CellState.FILLED], [CellState.POINTER], [CellState.FILLED]],
            // horisontal
            [[CellState.FILLED, CellState.FILLED, CellState.POINTER, CellState.FILLED]],
        ];
    }
}
