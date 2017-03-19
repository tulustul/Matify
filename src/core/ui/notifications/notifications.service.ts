import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  args?: any;
  secondaryContent?: (args: any) => string;
  disposable?: boolean;
  type?: 'success' | 'warn' | 'error' | 'info';
}

@Injectable()
export class NotificationsService {

  private _notifications: Notification[] = [];

  private _notifications$ = new Subject<Notification[]>();
  notifications$ = this._notifications$.asObservable();

  disposeTime = 5000;

  push(notification: Notification) {
    if (!notification.type) {
      notification.type = 'info';
    }
    this._notifications.push(notification);
    if (notification.disposable !== false) {
      this.scheduleDispose(notification);
    }
    this._notifications$.next(this._notifications);
    return notification;
  }

  scheduleDispose(notification: Notification) {
    setTimeout(() => {
      let index = this._notifications.indexOf(notification);
      if (index !== -1) {
        this._notifications.splice(index, 1);
        this._notifications$.next(this._notifications);
      }
    }, this.disposeTime);
  }

}
