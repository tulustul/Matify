import { Injectable } from '@angular/core';

import { Command } from 'core/commands';

import { TrackSchedulerService } from './trackScheduler.service';

@Injectable()
export class Commands {

  constructor(private trackScheduler: TrackSchedulerService) {}

  @Command({
    name: 'trackScheduler.randomOrder',
    displayName: 'Tracks order: random',
  })
  randomOrder() {
    this.trackScheduler.setOrder('random');
  }

  @Command({
    name: 'trackScheduler.oneByOneOrder',
    displayName: 'Tracks order: one by one',
  })
  oneByOneOrder() {
    this.trackScheduler.setOrder('oneByOne');
  }

}
