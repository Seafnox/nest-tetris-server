import { ClientStatus } from '../enums/client-status';

export function getViewIdByClientState(state: ClientStatus): string {
  return `${state.toLowerCase()}-view`;
}
