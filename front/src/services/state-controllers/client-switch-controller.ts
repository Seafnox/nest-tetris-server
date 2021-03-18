import { Subscription } from 'rxjs';
import { ClientMode } from '../../enums/client-mode';
import { ClientStatus } from '../../enums/client-status';
import { UserStore } from '../user-store';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientSwitchController implements ClientStateController {
  private readonly clientStore = this.injector.inject(UserStore);
  private subscription: Subscription;

  constructor(private injector: InjectorService) {}

  @Logger()
  public start(): void {
    this.subscription = this.clientStore.mode$().subscribe(mode => {
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
