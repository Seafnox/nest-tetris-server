import { noop } from 'rxjs';
import { Direction } from '../direction';
import { GameState } from '../game-state';
import { GameConst } from '../game.constants';

export abstract class Figure {
    public abstract isRollable: boolean;
    public abstract view: GameState;

    public posX = GameConst.rowsCount;
    public posY = Math.round(GameConst.colsCount / 2);

    public abstract mapToState(state: GameState): GameState;

    public abstract isLastAvailableX(state: GameState): boolean;

    public abstract isLeftMoveAvailable(state: GameState): boolean;

    public abstract isRightMoveAvailable(state: GameState): boolean;

    public abstract onRoll(state: GameState, direction: Direction): void;

    public dropInState(state: GameState): GameState {
        while(!this.isLastAvailableX(state)) {
            this.moveDown();
        }

        return this.mapToState(state);
    }

    public onMove(state: GameState, direction: Direction): void {
        switch (direction) {
            case Direction.LEFT: return this.isLeftMoveAvailable(state) ? this.moveLeft() : noop();
            case Direction.RIGHT: return this.isRightMoveAvailable(state) ? this.moveRight() : noop();
            case Direction.DOWN: return !this.isLastAvailableX(state) ? this.moveDown() : noop();
        }
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
}
