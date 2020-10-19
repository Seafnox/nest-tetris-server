import { CellState } from '../cell-state';
import { GameState } from '../../interfaces/game-state';
import { Figure } from './figure';

export class OFigure extends Figure {
    public getViews(): GameState[] {
        return [
            [
                [CellState.FILLED, CellState.FILLED],
                [CellState.FILLED, CellState.POINTER],
            ],
        ];
    }
}
