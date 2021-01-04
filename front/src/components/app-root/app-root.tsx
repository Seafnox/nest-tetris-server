import { Component, h, State } from '@stencil/core';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { CellDto } from '~tetris/dto/cell-dto';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() score: number = 0;
  @State() level: number = 0;
  @State() nextItem: GameStateDto = [[]];
  @State() game: GameStateDto = [[]];

  private timer: NodeJS.Timer;

  checkNewState(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.score = Math.floor(Math.random()*10000);
      this.level = Math.floor(Math.random()*100);
      this.nextItem = this.generateState(4,4);
      this.game = this.generateState(20,10);
    }, 500);
  }

  generateState(x: number, y: number): GameStateDto {
    const randomic = `${Math.random().toString().substr(2)}${Math.random().toString().substr(2)}`;
    const randomicLength = randomic.length;

    return Array(x).fill(null).map((_, indexX) => {
      return Array(y).fill(null).map((_, indexY) =>
        (+randomic[(indexX * indexY) % randomicLength]) >= 5 ? CellDto.FILLED : CellDto.EMPTY)
    });
  }

  render(): string {
    this.checkNewState();

    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <div class="app-home">
            <p>
              Welcome to the Stencil App Starter. You can use this starter to build entire apps all with web components using Stencil! Check out our docs on{' '}
              <a href="https://stenciljs.com">stenciljs.com</a> to get started.
            </p>
          </div>
        </main>

        <game-wrapper score={this.score} level={this.level} nextItem={this.nextItem} state={this.game}></game-wrapper>
      </div>
    );
  }
}
