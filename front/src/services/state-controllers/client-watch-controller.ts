import { Logger } from '../logger/logger';
import { ClientStatusController } from './client-status-controller';

export class ClientWatchController implements ClientStatusController {
  @Logger()
  public start(): void {
  }

  @Logger()
  public stop(): void {
  }
}
