import { GameApiService } from 'src/services/game-api-service';

export class GameApiServiceFactory {
  private static unit: GameApiService;

  public static get(): GameApiService {
    if (!GameApiServiceFactory.unit) {
      GameApiServiceFactory.unit = new GameApiService();
    }

    return GameApiServiceFactory.unit;
  }
}
