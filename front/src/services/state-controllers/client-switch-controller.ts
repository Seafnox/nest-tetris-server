import { Subscription } from 'rxjs';
import { ClientMode } from '../../enums/client-mode';
import { ClientStatus } from '../../enums/client-status';
import { UserStore } from '../user-store';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStatusController } from './client-status-controller';

export class ClientSwitchController implements ClientStatusController {
  private readonly clientStore = this.injector.inject(UserStore);
  private subscription: Subscription;

  constructor(private injector: InjectorService) {}

  @Logger()
  public start(): void {
    this.subscription = this.clientStore.mode$().subscribe(mode => {
      console.log('switch', mode);
      switch (mode) {
        case ClientMode.WatchingMode:
          return this.clientStore.switchStatus(ClientStatus.Watching);
        case ClientMode.PlayingMode:
          return this.clientStore.switchStatus(ClientStatus.Playing);
      }
    })
  }

  @Logger()
  public stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
