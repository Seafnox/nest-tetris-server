import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ClientMode } from '../enums/client-mode';
import { ClientStatus } from '../enums/client-status';
import { ClientStatusGuard } from './client-status-guard';
import { InjectorService } from './Injector-factory';
import { Logger } from './logger/logger';

export interface UserState {
  userName: string;
  mode: ClientMode;
  status: ClientStatus;
  isLogin: boolean;
}

export class UserStore {
  private state = new BehaviorSubject<UserState>({
    userName: `test-${Math.floor(Math.random()*1000)}`,
    mode: ClientMode.None,
    status: ClientStatus.Init,
    isLogin: false,
  });

  private readonly statusGuard = this.injector.inject(ClientStatusGuard);

  constructor(private injector: InjectorService) {}

  @Logger()
  public setClientMode(mode: ClientMode): void {
    this.patchState({ mode });
  }

  @Logger()
  public setUserName(userName: string): void {
    this.patchState({ userName });
  }

  @Logger()
  public switchStatus(status: ClientStatus): void {
    const state = this.getState();

    if (this.statusGuard.isAvailableStatus(status, state.status)) {
      this.patchState({ status });
    }
  }

  public snapshot(): UserState {
    return this.state.value;
  }

  public state$(): Observable<UserState> {
    return this.state.asObservable();
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

  private getState(): UserState {
    return this.state.value;
  }

  private patchState(state: Partial<UserState>): void {
    const prevState = this.getState();

    this.state.next({
      ...prevState,
      ...state,
    })
  }
}
