export * from './trackIndicator.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES, BAR_COMPONENTS } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { TrackIndicatorComponent } from './trackIndicator.component';
import { Commands } from './commands';

@NgModule({
  declarations: [
    TrackIndicatorComponent,
  ],
  entryComponents: [TrackIndicatorComponent],
  exports: [TrackIndicatorComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class TrackIndicatorModule { }

MODULES.push(TrackIndicatorModule);
BAR_COMPONENTS.push(TrackIndicatorComponent);
