export * from './sourceIndicator.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES, BAR_COMPONENTS } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SourceIndicatorComponent } from './sourceIndicator.component';

@NgModule({
  declarations: [
    SourceIndicatorComponent,
  ],
  entryComponents: [SourceIndicatorComponent],
  exports: [SourceIndicatorComponent],
  imports: [CommonModule, CoreModule],
})
class SourceIndicatorModule { }

MODULES.push(SourceIndicatorModule);
BAR_COMPONENTS.push(SourceIndicatorComponent);
