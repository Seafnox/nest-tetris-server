import { ClientState } from '../enums/client-state';

export class ActiveViewService {
  public static getIdByClientState = (state: ClientState): string => `${state.toLowerCase()}-view`;
}
