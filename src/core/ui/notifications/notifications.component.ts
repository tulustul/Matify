import { Component, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';

import { NotificationsService, Notification } from './notifications.service';

@Component({
  selector: 'mp-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {

  notifications: Notification[];

  constructor(
    notificationsService: NotificationsService,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    notificationsService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });

    setInterval(() => changeDetectorRef.detectChanges(), 100);
  }

}
