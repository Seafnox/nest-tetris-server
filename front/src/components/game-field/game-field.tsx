import { Component, Host, h, Prop } from '@stencil/core';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { CellDto } from '~tetris/dto/cell-dto';
import { GameFieldSize } from '../game-wrapper/game-field-size';

@Component({
  tag: 'game-field',
  styleUrl: 'game-field.css',
  shadow: true,
})
export class GameField {
  @Prop() state: GameStateDto;
  @Prop() size: GameFieldSize = GameFieldSize.Large;
  @Prop() useBgCells: boolean = true;

  render(): string {
    if (!this.state) {
      return (<Host></Host>);
    }

    return (<Host>
      {this.state.map(row => {
        return (<div class={{
          row: true,
          small: this.size === GameFieldSize.Small,
        }}>{row.map(cell => {
          return (<div class={{
            cell: true,
            small: this.size === GameFieldSize.Small,
            hide: !this.useBgCells && cell === CellDto.EMPTY,
            empty: cell === CellDto.EMPTY
          }}></div>);
        })}</div>);
      })}
    </Host>);
  }

}
