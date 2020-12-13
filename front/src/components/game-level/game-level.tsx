import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'game-level',
  styleUrl: 'game-level.css',
  shadow: true,
})
export class GameLevel {
  @Prop() level: number;

  render(): string {
    return `${this.level}`;
  }

}
