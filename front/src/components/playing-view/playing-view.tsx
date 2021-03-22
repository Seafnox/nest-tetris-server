import { Component, Host, h, State } from '@stencil/core';
import { switchMap } from 'rxjs/operators';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserGame, UserStore } from '../../services/user-store';

@Component({
  tag: 'playing-view',
  styleUrl: 'playing-view.css',
  shadow: true,
})
export class PlayingView {
  @State() game: Partial<UserGame> = {};
  private readonly clientStore = InjectorFactory.get().inject(UserStore);

  constructor() {
    this.clientStore.userName$()
      .pipe(
        switchMap(userName => this.clientStore.game$(userName)),
      )
      .subscribe(game => this.game = game)
  }

  public render(): string {
    return (
      <Host>
        {this.game ? this.renderGame(this.game) : 'NONE'}
      </Host>
    );
  }

  private renderGame(game: Partial<UserGame>): string {
    return (
      <game-wrapper score={game.score} level={game.level} nextItem={game.nextItem} state={game.gameField}></game-wrapper>
    )
  }
}
