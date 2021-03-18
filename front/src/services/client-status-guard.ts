import { ClientStatus } from '../enums/client-status';

export class ClientStatusGuard {
  private availableStatuses: Record<ClientStatus, ClientStatus[]> = {
    [ClientStatus.Init]: [ClientStatus.Signing],
    [ClientStatus.Signing]: [ClientStatus.Switching],
    [ClientStatus.Switching]: [ClientStatus.Playing, ClientStatus.Watching],
    [ClientStatus.Playing]: [ClientStatus.Switching],
    [ClientStatus.Watching]: [ClientStatus.Switching],
  }

  public isAvailableStatus(nextStatus: ClientStatus, prevStatus: ClientStatus): boolean {
    if (!this.availableStatuses[prevStatus].includes(nextStatus)) {
      console.error(`Switching state from '${prevStatus}' to '${nextStatus}' is not valid!`);

      return false;
    }

    return true;
  }
}
