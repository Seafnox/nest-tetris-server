import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientPlayController implements ClientStateController {
  @Logger()
  public start(): void {
  }

  public stop(): void {
  }
}
