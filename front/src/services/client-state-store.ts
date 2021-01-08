import { ClientState } from '../enums/client-state';
import { getStateAtom } from '../helpers/get-state-atom';

export class ClientStateStore {
  private state = getStateAtom<ClientState>(ClientState.None);

  private availableStates: Record<ClientState, ClientState[]> = {
    [ClientState.None]: [ClientState.Signing],
    [ClientState.Signing]: [ClientState.Switching],
    [ClientState.Switching]: [ClientState.Playing, ClientState.Watching],
    [ClientState.Playing]: [ClientState.Switching],
    [ClientState.Watching]: [ClientState.Switching],
  }

  public addClientStateListener(cb: (state: ClientState) => void): symbol {
    return this.state.addListener(cb);
  }

  public switchState(clientState: ClientState): void {
    if (!this.availableStates[this.state.getState()].includes(clientState)) {
      console.error(`Switching state from '${this.state.getState()}' to '${clientState}' is not valid!`);

      return;
    }

    this.state.setState(clientState);
  }
}