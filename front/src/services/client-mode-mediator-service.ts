import { ClientMode } from '../enums/client-mode';
import { getStateAtom } from './get-state-atom';

export class ClientModeMediatorService {
  public setClientMode: (mode: ClientMode) => void;
  public onClientModeChange: (cb: (mode: ClientMode) => void) => void;

  constructor() {
    const {onStateChange, setState} = getStateAtom<ClientMode>();
    this.setClientMode = setState;
    this.onClientModeChange = onStateChange;

    this.onClientModeChange(mode => this.clientModeChanged(mode));
  }

  private clientModeChanged(mode: ClientMode): void {
    switch (mode) {
      case ClientMode.PlayingMode:
        return this.switchClientToPlayingMode();
      case ClientMode.WatchingMode:
        return this.switchClientToWatchMode();
    }
  }

  private switchClientToPlayingMode() {
    // TODO
  }

  private switchClientToWatchMode() {
    // TODO
  }
}
