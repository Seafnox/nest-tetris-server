import { getStateAtom } from '../helpers/get-state-atom';
import { Logger } from './logger/logger';

export interface UserState {
  userName?: string;
}

export class UserStore {
  public readonly addUserListener: (cb: (user: UserState) => void) => symbol;
  public readonly removeUserListener: (listenerId: symbol) => void;

  private readonly setUser: (state: UserState) => void;
  private readonly getUserState: () => UserState;

  constructor() {
    const {setState, addListener, removeListener, getState} = getStateAtom<UserState>({
      userName: `test-${Math.floor(Math.random()*1000)}`,
    });

    this.setUser = setState;
    this.getUserState = getState;
    this.addUserListener = addListener;
    this.removeUserListener = removeListener;
  }

  @Logger()
  public patch(partialUser: Partial<UserState>): void {
    const currentState = this.getUserState();

    this.setUser({
      ...currentState,
      ...partialUser,
    });
  }

  public snapshot(): UserState {
    return this.getUserState();
  }
}
