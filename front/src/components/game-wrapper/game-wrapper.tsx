import { Component, Host, h, Prop } from '@stencil/core';
import { GameStateDto } from '~tetris/dto/game-state-dto';

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

  render(): string {
    return (
      <Host>
        <div class="header">
          <game-score score={this.score}></game-score>
          <game-level level={this.level}></game-level>
        </div>
        <div class="content">
          <game-field state={this.state}></game-field>
          <game-field class="next-item" state={this.nextItem}></game-field>
        </div>
      </Host>
    );
  }

}
