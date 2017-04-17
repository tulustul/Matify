import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { NotificationsService } from 'core/ui/notifications';

@Injectable()
export class Commands {

  constructor(
    private notifications: NotificationsService,
  ) {}

  @Command({
    name: 'notificationsPlayground.spawnNotification',
    displayName: 'Notifications playground: spawn notification',
  })
  spawnNotification() {
    this.notifications.push({
      message: 'This is random notification',
      // disposable: false,
    });
  }

}
