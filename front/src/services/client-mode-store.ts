import { ClientMode } from '../enums/client-mode';
import { getStateAtom } from '../helpers/get-state-atom';

export class ClientModeStore {
  private state = getStateAtom<ClientMode>();

  public setClientMode(mode: ClientMode): void {
    this.state.setState(mode);
  }

  public addClientModeListener(cb: (mode: ClientMode) => void): symbol {
    return this.state.addListener(cb);
  }

  public removeClientModeListener(listenerId: symbol): void {
    this.state.removeListener(listenerId);
  }
}
