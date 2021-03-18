import { ClientStatus } from '../../enums/client-status';
import { UserStore } from '../user-store';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientInitialController implements ClientStateController {
  private readonly clientStore = this.injector.inject(UserStore);

  constructor(private readonly injector: InjectorService) {}

  @Logger()
  public start(): void {
    return this.clientStore.switchStatus(ClientStatus.Signing);
  }

  @Logger()
  public stop(): void {
  }
}
