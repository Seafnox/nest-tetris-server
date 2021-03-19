import { ClientStatus } from '../enums/client-status';
import { UserStore } from './user-store';
import { InjectorService } from './Injector-factory';
import { ClientInitialController } from './state-controllers/client-initial-controller';
import { ClientPlayController } from './state-controllers/client-play-controller';
import { ClientSignController } from './state-controllers/client-sign-controller';
import { ClientStatusController } from './state-controllers/client-status-controller';
import { ClientSwitchController } from './state-controllers/client-switch-controller';
import { ClientWatchController } from './state-controllers/client-watch-controller';

export class ClientStatusMediatorService {
  private _activeController: ClientStatusController;

  private controllerByTypes: Record<ClientStatus, new (injector: InjectorService) => ClientStatusController> = {
    [ClientStatus.Init]: ClientInitialController,
    [ClientStatus.Signing]: ClientSignController,
    [ClientStatus.Switching]: ClientSwitchController,
    [ClientStatus.Playing]: ClientPlayController,
    [ClientStatus.Watching]: ClientWatchController,
  }

  private readonly clientStore = this.injector.inject(UserStore);

  constructor(private readonly injector: InjectorService) {}

  public init(): void {
    this.clientStore.status$().subscribe(status => this.statusChanged(status));
  }

  private statusChanged(clientStatus: ClientStatus): void {
    this._activeController?.stop();

    this._activeController = this.injector.inject(this.controllerByTypes[clientStatus]);

    this._activeController.start();
  }
}
