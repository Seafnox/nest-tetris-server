import { CellState } from '../game/cell-state';

export type GameState = GameRow[];

export type GameRow = GameCell[];

export type GameCell = CellState;
