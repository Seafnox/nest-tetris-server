import { Subscription } from 'rxjs';
import { switchMap, filter, mapTo } from 'rxjs/operators';
import { BaseServerEventDto } from '~tetris/dto/base-server-event-dto';
import { ClientMode } from '../../enums/client-mode';
import { ClientStatus } from '../../enums/client-status';
import { UserStore } from '../user-store';
import { GameApiService } from '../game-api-service';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { UserNotificationsService } from '../user-notifications-service';
import { ClientStatusController } from './client-status-controller';

export class ClientSignController implements ClientStatusController {
  private readonly gameApiService = this.injector.inject(GameApiService);
  private readonly userNotificationsService = this.injector.inject(UserNotificationsService);
  private readonly clientStore = this.injector.inject(UserStore);
  private signInSub: Subscription;
  private signOnSub: Subscription;

  constructor(private injector: InjectorService) {}

  @Logger()
  public start(): void {
    this.signInSub = this.clientStore.userName$().pipe(
        filter<string>(Boolean),
        switchMap(userName => this.gameApiService.whenConnected$().pipe(mapTo(userName)))
      )
      .subscribe(userName => this.gameApiService.registerUser({ userName }));

    this.signOnSub = this.gameApiService.whenConnected$()
      .pipe(
        switchMap(() => this.gameApiService.onSignOn$),
      )
      .subscribe(dto => this.onSignOn(dto));
  }

  @Logger()
  public stop(): void {
    this.signInSub?.unsubscribe();
    this.signInSub = undefined;

    this.signOnSub?.unsubscribe();
    this.signOnSub = undefined;
  }

  @Logger()
  private onSignOn(dto: BaseServerEventDto) {
    this.userNotificationsService.pushNotification({
      message: `There ${dto.numUsers} user${dto.numUsers === 1 ? '' : 's'} now`,
    });
    this.clientStore.setClientMode(ClientMode.WatchingMode);
    this.clientStore.switchStatus(ClientStatus.Switching);
  }
}
