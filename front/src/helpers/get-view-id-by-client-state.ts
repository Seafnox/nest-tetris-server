import { ClientState } from '../enums/client-state';

export function getViewIdByClientState(state: ClientState): string {
  return `${state.toLowerCase()}-view`;
}
