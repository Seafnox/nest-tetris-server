import { ClientMode } from '../../enums/client-mode';
import { ClientState } from '../../enums/client-state';
import { ClientModeMediatorService } from '../client-mode-mediator-service';
import { ClientStateStore } from '../client-state-store';
import { GameApiService } from '../game-api-service';
import { InjectorService } from '../Injector-factory';
import { UserNotificationsService } from '../user-notifications-service';
import { UserStateService } from '../user-state-service';
import { ClientStateController } from './client-state-controller';

export class ClientSignController implements ClientStateController {
  private readonly userStateService: UserStateService;
  private readonly gameApiService: GameApiService;
  private readonly userNotificationsService: UserNotificationsService;
  private readonly clientModeMediatorService: ClientModeMediatorService;
  private readonly clientStateStore: ClientStateStore;
  private listenerId: symbol;

  constructor(injector: InjectorService) {
    this.userStateService = injector.inject(UserStateService);
    this.gameApiService = injector.inject(GameApiService);
    this.userNotificationsService = injector.inject(UserNotificationsService);
    this.clientModeMediatorService = injector.inject(ClientModeMediatorService);
    this.clientStateStore = injector.inject(ClientStateStore);
  }
  public start(): void {
    this.listenerId = this.userStateService.addUserListener(user => {
      if (!user || !user.userName) {
        return;
      }

      this.gameApiService.registerUser({
        userName: user.userName,
      });
    });

    // TODO Fix infinity subscription
    this.gameApiService.onLoginSuccess(dto => {
      this.userNotificationsService.pushNotification({
        message: `There ${dto.numUsers} user${dto.numUsers === 1 ? '' : 's'} now`,
      });
      this.clientModeMediatorService.setClientMode(ClientMode.WatchingMode);
      this.clientStateStore.switchState(ClientState.Switching);
    });
  }

  public stop(): void {
    this.userStateService.removeUserListener(this.listenerId);
    this.listenerId = undefined;
  }
}
