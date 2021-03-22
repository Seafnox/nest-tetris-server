import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { GameStateDto } from '~tetris/dto/game-state-dto';
import { ClientMode } from '../enums/client-mode';
import { ClientStatus } from '../enums/client-status';
import { ClientStatusGuard } from './client-status-guard';
import { InjectorService } from './Injector-factory';
import { Logger } from './logger/logger';

export interface UserState {
  userId: string;
  userName: string;
  mode: ClientMode;
  status: ClientStatus;
  isLogin: boolean;
  games: Record<string, Partial<UserGame>>;
}

export interface UserGame {
  gameField: GameStateDto,
  nextItem: GameStateDto,
  level: number,
  score: number,
}

export class UserStore {
  private state = new BehaviorSubject<UserState>({
    userId: '',
    userName: `test-${Math.floor(Math.random()*1000)}`,
    mode: ClientMode.None,
    status: ClientStatus.Init,
    isLogin: false,
    games: {},
  });

  private readonly statusGuard = this.injector.inject(ClientStatusGuard);

  constructor(private injector: InjectorService) {}

  public setClientMode(mode: ClientMode): void {
    this.patchState({ mode });
  }

  public setUserName(userName: string): void {
    this.patchState({ userName });
  }

  public setUserId(userId: string) {
    this.patchState({ userId });
  }

  public switchStatus(status: ClientStatus): void {
    const state = this.getState();

    if (this.statusGuard.isAvailableStatus(status, state.status)) {
      this.patchState({ status });
    }
  }

  public clearGames(): void {
    this.patchState({ games: {} });
  }

  public setGameField(username: string, gameField: GameStateDto): void {
    this.patchGames(username, { gameField });
  }

  public setNextItem(username: string, nextItem: GameStateDto) {
    this.patchGames(username, { nextItem });
  }

  public setLevel(username: string, level: number) {
    this.patchGames(username, { level });
  }

  public setScore(username: string, score: number) {
    this.patchGames(username, { score });
  }

  public snapshot(): UserState {
    return this.state.value;
  }

  public state$(): Observable<UserState> {
    return this.state.asObservable().pipe(delay(0));
  }

  public mode$(): Observable<ClientMode> {
    return this.state$().pipe(
      map(state => state.mode),
      distinctUntilChanged(),
    );
  }

  public status$(): Observable<ClientStatus> {
    return this.state$().pipe(
      map(state => state.status),
      distinctUntilChanged(),
    );
  }

  public userName$(): Observable<string> {
    return this.state$().pipe(
      map(state => state.userName),
      distinctUntilChanged(),
    );
  }

  public watchingUsers$(): Observable<string[]> {
    return this.state$().pipe(
      map(state => Object.keys(state.games)),
      distinctUntilChanged(),
    );
  }

  public game$(username: string): Observable<Partial<UserGame>> {
    return this.state$().pipe(
      map(state => state.games[username] ?? {}),
      distinctUntilChanged(),
    )
  }

  public games$(): Observable<Record<string, Partial<UserGame>>> {
    return this.state$().pipe(
      map(state => state.games),
      distinctUntilChanged(),
    )
  }

  private getState(): UserState {
    return this.state.value;
  }

  @Logger()
  private patchGames(username: string, gameState: Partial<UserGame>): void {
    const { games } = this.getState();
    const game = games[username] ?? {};

    this.patchState({
      games: {
        ...games,
        [username]: {
          ...game,
          ...gameState,
        },
      }
    })
  }

  @Logger()
  private patchState(state: Partial<UserState>): void {
    const prevState = this.getState();

    this.state.next({
      ...prevState,
      ...state,
    });
  }
}
