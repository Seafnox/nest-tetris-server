import { Component, Prop, h } from '@stencil/core';
import { GameFieldSize } from '../game-wrapper/game-field-size';

@Component({
  tag: 'game-score',
  styleUrl: 'game-score.css',
  shadow: true,
})
export class GameScore {
  @Prop() score: number;
  @Prop() size: GameFieldSize = GameFieldSize.Large;

  render(): string {
    return (
      <span class={this.size === GameFieldSize.Small ? 'score small' : 'score'}>
        SCR: {this.score ?? '?'}
      </span>
    );
  }

}
