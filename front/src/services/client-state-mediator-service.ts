import { ClientState } from '../enums/client-state';
import { ClientStateStore } from './client-state-store';
import { InjectorService } from './Injector-factory';
import { ClientInitialController } from './state-controllers/client-initial-controller';
import { ClientPlayController } from './state-controllers/client-play-controller';
import { ClientSignController } from './state-controllers/client-sign-controller';
import { ClientStateController } from './state-controllers/client-state-controller';
import { ClientSwitchController } from './state-controllers/client-switch-controller';
import { ClientWatchController } from './state-controllers/client-watch-controller';

export class ClientStateMediatorService {
  private clientStateStore: ClientStateStore;
  private _activeController: ClientStateController;

  private controllerByTypes: Record<ClientState, new (injector: InjectorService) => ClientStateController> = {
    [ClientState.Init]: ClientInitialController,
    [ClientState.Signing]: ClientSignController,
    [ClientState.Switching]: ClientSwitchController,
    [ClientState.Playing]: ClientPlayController,
    [ClientState.Watching]: ClientWatchController,
  }

  constructor(private injector: InjectorService) {
    this.clientStateStore = this.injector.inject(ClientStateStore);
  }

  public init(): void {
    this.clientStateStore.addClientStateListener(state => this.stateChanged(state));
  }

  private stateChanged(clientState: ClientState): void {
    if (this._activeController) {
      this._activeController.stop();
    }

    this._activeController = this.injector.inject(this.controllerByTypes[clientState]);

    this._activeController.start();
  }
}
