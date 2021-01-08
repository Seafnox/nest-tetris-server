import { ClientMode } from '../../enums/client-mode';
import { ClientState } from '../../enums/client-state';
import { ClientModeStore } from '../client-mode-store';
import { ClientStateStore } from '../client-state-store';
import { InjectorService } from '../Injector-factory';
import { ClientStateController } from './client-state-controller';

export class ClientSwitchController implements ClientStateController {
  private readonly clientModeMediatorService: ClientModeStore;
  private readonly clientStateStore: ClientStateStore;
  private listenerId: symbol;

  constructor(injector: InjectorService) {
    this.clientModeMediatorService = injector.inject(ClientModeStore);
    this.clientStateStore = injector.inject(ClientStateStore);
  }
  public start(): void {
    this.listenerId = this.clientModeMediatorService.addClientModeListener(mode => {
      switch (mode) {
        case ClientMode.WatchingMode:
          return this.clientStateStore.switchState(ClientState.Watching);
        case ClientMode.PlayingMode:
          return this.clientStateStore.switchState(ClientState.Playing);
      }
    })
  }

  public stop(): void {
    this.clientModeMediatorService.removeClientModeListener(this.listenerId);
  }
}
