import { CellDto } from '../../../dto/cell-dto';
import { CellState } from './cell-state';

export const gameViewMap: Record<CellState, CellDto> = {
    [CellState.EMPTY]: CellDto.EMPTY,
    [CellState.FILLED]: CellDto.FILLED,
    [CellState.POINTER]: CellDto.FILLED,
}
