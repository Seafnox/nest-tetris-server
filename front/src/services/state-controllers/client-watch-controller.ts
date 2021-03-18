import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientWatchController implements ClientStateController {
  @Logger()
  public start(): void {
  }

  @Logger()
  public stop(): void {
  }
}
