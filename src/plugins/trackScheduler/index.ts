export * from './trackScheduler.service';

import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';

import { TrackSchedulerService } from './trackScheduler.service';

@Plugin()
@NgModule({
  providers: [TrackSchedulerService],
})
export class Module { }
