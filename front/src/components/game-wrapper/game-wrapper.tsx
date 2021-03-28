import { Component, Host, h, Prop } from '@stencil/core';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { GameFieldSize } from './game-field-size';

@Component({
  tag: 'game-wrapper',
  styleUrl: 'game-wrapper.css',
  shadow: true,
})
export class GameWrapper {
  @Prop() state: GameStateDto;
  @Prop() nextItem: GameStateDto;
  @Prop() score: number;
  @Prop() level: number;
  @Prop() size: GameFieldSize = GameFieldSize.Large;

  render(): string {
    return (
      <Host>
        <div class="header">
          <game-score score={this.score} size={this.size}></game-score>
          <game-level level={this.level} size={this.size}></game-level>
        </div>
        <div class="content">
          <game-field state={this.state} size={this.size}></game-field>
          <game-field class="next-item" state={this.nextItem} size={this.size} useBgCells={false}></game-field>
        </div>
      </Host>
    );
  }

}
