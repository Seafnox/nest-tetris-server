import { CellDto } from './cell-dto';

export type GameStateDto = GameRowStateDto[];

export type GameRowStateDto = GameCellStateDto[];

export type GameCellStateDto = CellDto;
