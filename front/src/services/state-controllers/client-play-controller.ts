import { Logger } from '../logger/logger';
import { ClientStateController } from './client-state-controller';

export class ClientPlayController implements ClientStateController {
  @Logger()
  public start(): void {
  }

  @Logger()
  public stop(): void {
  }
}
