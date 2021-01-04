import { ClientState } from '../enums/client-state';
import { ClientPlayController } from './state-controllers/client-play-controller';
import { ClientSignController } from './state-controllers/client-sign-controller';
import { ClientStateController } from './state-controllers/client-state-controller';
import { ClientSwitchController } from './state-controllers/client-switch-controller';
import { ClientWatchController } from './state-controllers/client-watch-controller';
import { InjectorService } from './Injector-factory';

export class ClientStateMediatorService {
  private _activeState: ClientState = ClientState.None;

  private availableStates: Record<ClientState, ClientState[]> = {
    [ClientState.None]: [ClientState.Signing],
    [ClientState.Signing]: [ClientState.Switching],
    [ClientState.Switching]: [ClientState.Playing, ClientState.Watching],
    [ClientState.Playing]: [ClientState.Switching],
    [ClientState.Watching]: [ClientState.Switching],
  }

  private _activeController: ClientStateController;

  private controllerByTypes: Record<ClientState, new () => ClientStateController> = {
    [ClientState.None]: null,
    [ClientState.Signing]: ClientSignController,
    [ClientState.Switching]: ClientSwitchController,
    [ClientState.Playing]: ClientPlayController,
    [ClientState.Watching]: ClientWatchController,
  }

  constructor(private injector: InjectorService) {}

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

  public stateChanged(clientState: ClientState): void {
    if (this._activeController) {
      this._activeController.stop();
    }

    this._activeController = this.injector.inject(this.controllerByTypes[clientState]);

    this._activeController.start();
  }
}
