import { ClientState } from '../../enums/client-state';
import { ClientStateStore } from '../client-state-store';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientInitialController implements ClientStateController {
  private readonly clientStateStore: ClientStateStore;

  constructor(injector: InjectorService) {
    this.clientStateStore = injector.inject(ClientStateStore);
  }

  @Logger()
  public start(): void {
    return this.clientStateStore.switchState(ClientState.Signing);
  }

  public stop(): void {
  }
}
