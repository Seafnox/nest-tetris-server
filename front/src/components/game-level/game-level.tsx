import { Component, Prop, h } from '@stencil/core';
import { GameFieldSize } from '../game-wrapper/game-field-size';

@Component({
  tag: 'game-level',
  styleUrl: 'game-level.css',
  shadow: true,
})
export class GameLevel {
  @Prop() level: number;
  @Prop() size: GameFieldSize = GameFieldSize.Large;

  render(): string {
    return (
      <span class={this.size === GameFieldSize.Small ? 'level small' : 'level'}>
        LVL: {this.level ?? '?'}
      </span>
    );
  }

}
