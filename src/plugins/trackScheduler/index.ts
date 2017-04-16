export * from './trackScheduler.service';

import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';

import { TrackSchedulerService } from './trackScheduler.service';
import { OrderChooserComponent } from './orderChooser.component';
import { Commands } from './commands';

@Plugin({
  barComponents: [OrderChooserComponent],
})
@NgModule({
  declarations: [
    OrderChooserComponent,
  ],
  entryComponents: [
    OrderChooserComponent,
  ],
  providers: [
    TrackSchedulerService,
    Commands,
  ],
})
export class Module { }
