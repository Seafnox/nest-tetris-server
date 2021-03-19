import { Logger } from '../logger/logger';
import { ClientStatusController } from './client-status-controller';

export class ClientPlayController implements ClientStatusController {
  @Logger()
  public start(): void {
  }

  @Logger()
  public stop(): void {
  }
}
