import { ClientState } from '../enums/client-state';

export class ClientStateMediatorService {
  private _activeState: ClientState = ClientState.None;

  private availableStates: Record<ClientState, ClientState[]> = {
    [ClientState.None]: [ClientState.Signing],
    [ClientState.Signing]: [ClientState.Switching],
    [ClientState.Switching]: [ClientState.Playing, ClientState.Watching],
    [ClientState.Playing]: [ClientState.Switching],
    [ClientState.Watching]: [ClientState.Switching],
  }

  public set activeState(clientState: ClientState) {
    this._activeState = clientState;
    this.stateChanged(clientState);
  }

  public get activeState(): ClientState {
    return this._activeState;
  }

  public switchState(clientState: ClientState): void {
    if (!this.availableStates[this.activeState].includes(clientState)) {
      throw new Error(`Switching state from '${this.activeState}' to '${clientState}' is not valid!`);
    }

    this.activeState = clientState;
  }

  // TODO
  public stateChanged(clientState: ClientState): void {
    console.log(clientState);
  }
}
