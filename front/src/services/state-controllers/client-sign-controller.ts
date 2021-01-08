import { ClientMode } from '../../enums/client-mode';
import { ClientState } from '../../enums/client-state';
import { ClientModeStore } from '../client-mode-store';
import { ClientStateStore } from '../client-state-store';
import { GameApiService } from '../game-api-service';
import { InjectorService } from '../Injector-factory';
import { UserNotificationsService } from '../user-notifications-service';
import { UserStore } from '../user-store';
import { ClientStateController } from './client-state-controller';

export class ClientSignController implements ClientStateController {
  private readonly userStore: UserStore;
  private readonly gameApiService: GameApiService;
  private readonly userNotificationsService: UserNotificationsService;
  private readonly clientModeStore: ClientModeStore;
  private readonly clientStateStore: ClientStateStore;
  private listenerId: symbol;

  constructor(injector: InjectorService) {
    this.userStore = injector.inject(UserStore);
    this.gameApiService = injector.inject(GameApiService);
    this.userNotificationsService = injector.inject(UserNotificationsService);
    this.clientModeStore = injector.inject(ClientModeStore);
    this.clientStateStore = injector.inject(ClientStateStore);
  }
  public start(): void {
    this.listenerId = this.userStore.addUserListener(user => {
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
      this.clientModeStore.setClientMode(ClientMode.WatchingMode);
      this.clientStateStore.switchState(ClientState.Switching);
    });
  }

  public stop(): void {
    this.userStore.removeUserListener(this.listenerId);
    this.listenerId = undefined;
  }
}
