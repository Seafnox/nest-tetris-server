import { CellState } from './cell-state';

export const gameViewMap: Record<CellState, string> = {
    [CellState.EMPTY]: '',
    [CellState.FILLED]: '.',
    [CellState.POINTER]: '.',
}
