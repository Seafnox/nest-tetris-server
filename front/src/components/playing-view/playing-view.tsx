import { Component, Host, h, State, Listen } from '@stencil/core';
import { switchMap } from 'rxjs/operators';
import { DirectionDto } from '~tetris/dto/direction-dto';
import { GameApiService } from '../../services/game-api-service';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserGame, UserStore } from '../../services/user-store';

enum ActionKey {
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
}

@Component({
  tag: 'playing-view',
  styleUrl: 'playing-view.css',
  shadow: true,
})
export class PlayingView {
  @State() game: Partial<UserGame> = {};
  private readonly clientStore = InjectorFactory.get().inject(UserStore);
  private readonly gameApiService = InjectorFactory.get().inject(GameApiService);

  private gameActions: Record<ActionKey, () => void>

  //key: "ArrowLeft", keyCode: 37
  //key: "ArrowRight", keyCode: 39
  //key: "ArrowUp", keyCode: 38
  //key: "ArrowDown", keyCode: 40
  @Listen('keydown', { target: 'window' })
  onKeyDown(event: KeyboardEvent): void {
    if (Object.values<string>(ActionKey).includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();

      this.gameActions[event.key]();
    }
  }

  constructor() {
    this.clientStore.userName$()
      .pipe(
        switchMap(userName => this.clientStore.game$(userName)),
      )
      .subscribe(game => this.game = game);

    this.gameActions = this.getActions(this.gameApiService);
  }

  public render(): string {
    return (
      <Host>
        {this.game ? this.renderGame(this.game) : 'NONE'}
      </Host>
    );
  }

  private getActions(gameApi: GameApiService): Record<ActionKey, () => {}> {
    return {
      ArrowLeft: gameApi.moveFigure.bind(gameApi, DirectionDto.LEFT),
      ArrowRight: gameApi.moveFigure.bind(gameApi, DirectionDto.RIGHT),
      ArrowUp: gameApi.rotateFigure.bind(gameApi, DirectionDto.RIGHT),
      ArrowDown: gameApi.dropFigure.bind(gameApi),
    };
  }

  private renderGame(game: Partial<UserGame>): string {
    return (
      <game-wrapper score={game.score} level={game.level} nextItem={game.nextItem} state={game.gameField}></game-wrapper>
    )
  }
}
