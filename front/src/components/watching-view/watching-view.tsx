import { Component, h, State, Host } from '@stencil/core';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserGame, UserStore } from '../../services/user-store';
import { GameFieldSize } from '../game-wrapper/game-field-size';

@Component({
  tag: 'watching-view',
  styleUrl: 'watching-view.css',
  shadow: true,
})
export class WatchingView {
  @State() usernames: string[] = [];
  @State() games: Record<string, Partial<UserGame>> = {};
  private readonly clientStore = InjectorFactory.get().inject(UserStore);

  constructor() {
    this.clientStore.watchingUsers$().subscribe(usernames => this.usernames = usernames);
    this.clientStore.games$().subscribe(games => this.games = games);
  }

  public render(): string {
    return (
      <Host>
        <div class="games">
          {this.usernames.map(this.renderGame.bind(this))}
        </div>
      </Host>
    );
  }

  private renderGame(username: string): string {
    const game = this.games[username];

    if (!game) {
      return '';
    }

    return (
      <div class="game">
        {username}
        <game-wrapper score={game.score} level={game.level} nextItem={game.nextItem} state={game.gameField} size={GameFieldSize.Small}></game-wrapper>
      </div>
    )
  }
}
