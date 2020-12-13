import { Component, Prop } from '@stencil/core';
import { GameStateDto } from '../../../../dto/game-state-dto';
import { CellDto } from '../../../../dto/cell-dto';

@Component({
  tag: 'game-field',
  styleUrl: 'game-field.css',
  shadow: true,
})
export class GameField {
  @Prop() state: GameStateDto;

  render(): string {
    if (!this.state) {
      return ``;
    }

    return this.state.map(row => {
      return `<div class="row">${row.map(cell => {
        return `<div class="cell ${cell === CellDto.EMPTY ? 'empty' : ''}"></div>`;
      })}</div>`;
    }).join('');
  }

}
