export * from './trackScheduler.service';

import { NgModule } from '@angular/core';

import { MODULES } from 'core/plugging';

import { TrackSchedulerService } from './trackScheduler.service';

@NgModule({
  providers: [TrackSchedulerService],
})
export class TrackSchedulerModule { }

MODULES.push(TrackSchedulerModule);
