import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { NotificationsService } from 'core/ui/notifications';

import { TrackSchedulerService } from './trackScheduler.service';

@Injectable()
export class Commands {

  constructor(
    private trackScheduler: TrackSchedulerService,
    private notifications: NotificationsService,
  ) {}

  @Command({
    name: 'trackScheduler.randomOrder',
    displayName: 'Tracks order: random',
  })
  randomOrder() {
    this.trackScheduler.setOrder('random');
    this.notifications.push({
      message: 'Playing tracks at random order',
    });
  }

  @Command({
    name: 'trackScheduler.oneByOneOrder',
    displayName: 'Tracks order: one by one',
  })
  oneByOneOrder() {
    this.trackScheduler.setOrder('oneByOne');
    this.notifications.push({
      message: 'Playing tracks one by one',
    });
  }

}
