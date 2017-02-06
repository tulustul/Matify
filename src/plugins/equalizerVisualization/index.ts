import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from 'core/core.module';
import { MODULES, PAGES } from 'core/plugging';
import { EqualizerVisualizationService } from './equalizerVisualization.service';
import { Commands } from './commands';
import { EqualizerVisualizationComponent } from './equalizerVisualization.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [EqualizerVisualizationComponent],
  exports: [EqualizerVisualizationComponent],
  providers: [EqualizerVisualizationService, Commands],
})
export class EqualizerVisualizationModule { }

MODULES.push(EqualizerVisualizationModule);
