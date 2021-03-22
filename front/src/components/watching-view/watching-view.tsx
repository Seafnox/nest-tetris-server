import { Component, h, State, Host } from '@stencil/core';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserGame, UserStore } from '../../services/user-store';

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
        {this.renderGames()}
      </Host>
    );
  }

  private renderGames(): string {
    return (
      <Host>
        {this.usernames.map(username => this.games[username]).map(this.renderGame)}
      </Host>
    );
  }

  private renderGame(game: Partial<UserGame>): string {
    return (
      <game-wrapper score={game.score} level={game.level} nextItem={game.nextItem} state={game.gameField}></game-wrapper>
    )
  }
}
