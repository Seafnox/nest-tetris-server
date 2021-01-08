import { ClientMode } from '../enums/client-mode';
import { getStateAtom } from '../helpers/get-state-atom';

export class ClientModeMediatorService {
  public setClientMode: (mode: ClientMode) => void;
  public addClientModeListener: (cb: (mode: ClientMode) => void) => symbol;

  constructor() {
    const {addListener, setState} = getStateAtom<ClientMode>();
    this.setClientMode = setState;
    this.addClientModeListener = addListener;

    this.addClientModeListener(mode => this.clientModeChanged(mode));
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
