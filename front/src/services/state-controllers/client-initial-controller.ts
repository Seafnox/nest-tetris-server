import { ClientStatus } from '../../enums/client-status';
import { UserStore } from '../user-store';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStatusController } from './client-status-controller';

export class ClientInitialController implements ClientStatusController {
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
