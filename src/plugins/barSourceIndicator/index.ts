export * from './sourceIndicator.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SourceIndicatorComponent } from './sourceIndicator.component';

@Plugin({
  barComponents: [SourceIndicatorComponent],
})
@NgModule({
  declarations: [
    SourceIndicatorComponent,
  ],
  entryComponents: [SourceIndicatorComponent],
  exports: [SourceIndicatorComponent],
  imports: [CommonModule, CoreModule],
})
class Module { }
