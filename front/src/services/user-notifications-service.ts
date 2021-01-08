import { getStateAtom } from '../helpers/get-state-atom';

export interface Notification {
  message: string;
}

export class UserNotificationsService {
  private notificationsState = getStateAtom<Notification[]>([]);

  public pushNotification(notification: Notification): void {
    const currentState = this.notificationsState.getState();

    this.notificationsState.setState([
      ...currentState,
      notification,
    ]);
  }

  public addNotificationsListener(cb: (notifications: Notification[]) => void): symbol {
    return this.notificationsState.addListener(cb);
  }

  public removeNotificationListener(listenerId: symbol): void {
    this.notificationsState.removeListener(listenerId);
  }
}
