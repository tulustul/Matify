export * from './trackIndicator.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { TrackIndicatorComponent } from './trackIndicator.component';
import { Commands } from './commands';

@Plugin({
  barComponents: [TrackIndicatorComponent],
})
@NgModule({
  declarations: [
    TrackIndicatorComponent,
  ],
  entryComponents: [TrackIndicatorComponent],
  exports: [TrackIndicatorComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class Module { }
