import { noop } from 'rxjs';
import { CellConfig } from '../../interfaces/cell-config';
import { FigurePositionConfig } from '../../interfaces/figure-position-config';
import { GameState } from '../../interfaces/game-state';
import { PointerPositionConfig } from '../../interfaces/pointer-position-config';
import { CellState } from '../cell-state';
import { Direction } from '../direction';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { gameViewMap } from '../game-view-map';
import { GameConst } from '../game.constants';

export abstract class Figure {
    public isRotatable = this.getViews().length !== 1;

    public currentView = 0;

    public posX = GameConst.rowsCount + this.getInitialOffset();

    public posY = Math.round(GameConst.colsCount / 2);

    public name = this.constructor.name;

    public abstract getViews(): GameState[];

    public getInitialOffset(): number {
        const { posX } = this.getPointerConfig(this.getCurrentView());

        return this.getCurrentView().length - posX - 1;
    }

    public mapToState(state: GameState): GameState {
        const view = this.getCurrentView();
        const { firstY, firstX, lastY, lastX } = this.getFigurePositionConfig(view, this);
        return state.map((row, posX) => row.map((cell, posY) => {
            if (posX < firstX || posY < firstY || posX >= lastX || posY >= lastY) {
                return cell;
            }

            const offsetX = posX - firstX;
            const offsetY = posY - firstY;

            return view[offsetX][offsetY] === CellState.EMPTY ? cell : CellState.FILLED;
        }));
    }

    public isDownMoveAvailable(state: GameState): boolean {
        return !this.isStateHaveCollision(state, this.getCurrentView(), {posX: this.posX - 1, posY: this.posY});
    }

    public isLeftMoveAvailable(state: GameState): boolean {
        return !this.isStateHaveCollision(state, this.getCurrentView(), {posX: this.posX, posY: this.posY - 1});
    }

    public isRightMoveAvailable(state: GameState): boolean {
        return !this.isStateHaveCollision(state, this.getCurrentView(), {posX: this.posX, posY: this.posY + 1});
    }

    public onRotate(state: GameState, direction: Direction): void {
        if (!this.isRotatable) {
            return;
        }

        const nextViewNumber = direction === Direction.LEFT ? this.getPrevViewNumber() : this.getNextViewNumber();
        const nextView = this.getViews()[nextViewNumber];

        if (!this.isStateHaveCollision(state, nextView, { posX: this.posX, posY: this.posY })) {
            this.currentView = nextViewNumber;
        }
    }

    public getStateView(): GameStateDto {
        return this.getCurrentView().map(row => row.map(cell => gameViewMap[cell])).reverse();
    }

    public onFirstStep(): void {
        this.posX = this.posX - this.getInitialOffset();
    }

    public dropInState(state: GameState): GameState {
        while(this.isDownMoveAvailable(state)) {
            this.moveDown();
        }

        return this.mapToState(state);
    }

    public onMove(state: GameState, direction: Direction): void {
        switch (direction) {
            case Direction.LEFT: {
                return this.isLeftMoveAvailable(state) ? this.moveLeft() : noop();
            }
            case Direction.RIGHT: {
                return this.isRightMoveAvailable(state) ? this.moveRight() : noop();
            }
            case Direction.DOWN: return this.isDownMoveAvailable(state) ? this.moveDown() : noop();
        }
    }

    protected getPrevViewNumber(): number {
        const views = this.getViews();

        return (this.currentView - 1 + views.length) % views.length;
    }

    protected getNextViewNumber(): number {
        const views = this.getViews();

        return (this.currentView + 1) % views.length;
    }

    protected isStateHaveCollision(state: GameState, view: GameState, pointerPositionConfig: PointerPositionConfig): boolean {
        const { firstY, firstX, lastY, lastX } = this.getFigurePositionConfig(view, pointerPositionConfig);

        if (firstX < 0 || firstY < 0) {
            return true;
        }

        if (lastY > GameConst.colsCount) {
            return true;
        }

        return state.some((row, posX) => row.some((cell, posY) => {
            if (posX < firstX || posY < firstY || posX >= lastX || posY >= lastY) {
                return false;
            }

            const offsetX = posX - firstX;
            const offsetY = posY - firstY;

            return view[offsetX][offsetY] !== CellState.EMPTY && cell !== CellState.EMPTY
        }));
    }

    protected getCurrentView(): GameState {
        return this.getViews()[this.currentView];
    }

    protected getFigurePositionConfig(view: GameState, pointerPositionConfig: PointerPositionConfig): FigurePositionConfig {
        const pointerCoordinates = this.getPointerConfig(view);
        const pointerX = pointerPositionConfig.posX;
        const pointerY = pointerPositionConfig.posY;
        const firstX = pointerX - pointerCoordinates.posX;
        const firstY = pointerY - pointerCoordinates.posY;
        const lastX = firstX + view.length;
        const lastY = firstY + view[0].length;

        return { firstX, firstY, lastX, lastY, pointerX, pointerY };
    }

    protected getPointerConfig(view: GameState): CellConfig {
        return view
            .map((row, posX) => row.map((cell, posY) => ({posX, posY, cell})))
            .reduce((result, pseudoRow) => ([...result, ...pseudoRow]), [])
            .find(pseudoCell => pseudoCell.cell === CellState.POINTER);
    }

    protected moveLeft(): void {
        this.posY = this.posY - 1;
    }

    protected moveRight(): void {
        this.posY = this.posY + 1;
    }

    protected moveDown(): void {
        this.posX = this.posX - 1;
    }

    protected getCellState(state: GameState, posX: number, posY: number): CellState {
        if (posX >= GameConst.rowsCount && posY >= 0 && posY < GameConst.colsCount) {
            return CellState.EMPTY;
        }

        return state?.[posX]?.[posY] ?? CellState.FILLED;
    }

    protected isCellStateEmpty(state: GameState, posX: number, posY: number): boolean {
        return this.getCellState(state, posX, posY) === CellState.EMPTY;
    }
}
