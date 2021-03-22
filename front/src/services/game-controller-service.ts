import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameApiService } from './game-api-service';
import { InjectorService } from './Injector-factory';
import { UserStore } from './user-store';

export class GameControllerService {
  private readonly gameApiService = this.injector.inject(GameApiService);
  private readonly userStore = this.injector.inject(UserStore);
  private readonly onStop$ = new Subject<void>();

  constructor(private injector: InjectorService) {}

  public start(): void {
    this.gameApiService.onGameFieldUpdated$
      .pipe(takeUntil(this.onStop$))
      .subscribe(data => {
        this.userStore.setGameField(data.username, data.state);
      });

    this.gameApiService.onNextItemUpdated$
      .pipe(takeUntil(this.onStop$))
      .subscribe(data => {
        this.userStore.setNextItem(data.username, data.item);
      });

    this.gameApiService.onLevelUpdated$
      .pipe(takeUntil(this.onStop$))
      .subscribe(data => {
        this.userStore.setLevel(data.username, data.value);
      });

    this.gameApiService.onScoreUpdated$
      .pipe(takeUntil(this.onStop$))
      .subscribe(data => {
        this.userStore.setScore(data.username, data.value);
      });
  }

  public stop(): void {
    this.userStore.clearGames();
    this.onStop$.next();
  }
}
