import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { GameApiService } from '../game-api-service';
import { GameControllerService } from '../game-controller-service';
import { InjectorService } from '../Injector-factory';
import { Logger } from '../logger/logger';
import { ClientStatusController } from './client-status-controller';

export class ClientWatchController implements ClientStatusController {
  private readonly gameApiService = this.injector.inject(GameApiService);
  private readonly gameControllerService = this.injector.inject(GameControllerService);
  private readonly onStop$ = new Subject<void>();

  constructor(private injector: InjectorService) {}

  @Logger()
  public start(): void {
    this.gameControllerService.start();

    this.gameApiService.whenConnected$()
      .pipe(takeUntil(this.onStop$.asObservable()))
      .subscribe(() => this.gameApiService.startWatching())
  }

  @Logger()
  public stop(): void {
    this.gameControllerService.stop();

    this.gameApiService.whenConnected$()
      .pipe(take(1))
      .subscribe(() => this.gameApiService.stopWatching())

    this.onStop$.next();
  }
}
