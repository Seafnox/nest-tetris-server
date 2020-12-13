import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'game-score',
  styleUrl: 'game-score.css',
  shadow: true,
})
export class GameScore {
  @Prop() score: number;

  render(): string {
    return `${this.score}`;
  }

}
