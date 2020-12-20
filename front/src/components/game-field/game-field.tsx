import { Component, Host, h, Prop } from '@stencil/core';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { CellDto } from '~tetris/dto/cell-dto';

@Component({
  tag: 'game-field',
  styleUrl: 'game-field.css',
  shadow: true,
})
export class GameField {
  @Prop() state: GameStateDto;

  render(): string {
    if (!this.state) {
      return (<Host></Host>);
    }

    return (<Host>
      {this.state.map(row => {
        return (<div class="row">{row.map(cell => {
          return (<div class={{
            cell: true,
            empty: cell === CellDto.EMPTY
          }}></div>);
        })}</div>);
      })}
    </Host>);
  }

}
