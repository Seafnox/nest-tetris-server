import { getStateAtom } from './get-state-atom';
import { Logger } from './logger/logger';

export interface UserState {
  userName?: string;
}

export class UserStateService {
  public readonly onUserChange: (cb: (user: UserState) => void) => void;

  private readonly setUser: (state: UserState) => void;
  private readonly getUserState: () => UserState;

  constructor() {
    const {setState, onStateChange, getState} = getStateAtom<UserState>();

    this.setUser = setState;
    this.getUserState = getState;
    this.onUserChange = onStateChange;
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
