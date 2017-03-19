export * from './visualization.interface';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from 'core/core.module';
import { Plugin } from 'core/plugging';
import { VisualizationService } from './visualization.service';
import { VisualizationRenderer } from './visualizationRenderer.service';
import { Commands } from './commands';
import { VisualizationComponent } from './visualization.component';

@Plugin({
  visualizations: [
    {
      name: 'Column equalizer',
      fragmentShaderPath: 'src/plugins/visualization/shaders/equalizer.glsl',
      fftSize: 512,
      dataInterpolation: false,
    }, {
      name: 'Sparse column equalizer',
      fragmentShaderPath: 'src/plugins/visualization/shaders/equalizer.glsl',
      fftSize: 64,
      dataInterpolation: false,
    }, {
      name: 'Smooth equalizer',
      fragmentShaderPath: 'src/plugins/visualization/shaders/equalizer.glsl',
      fftSize: 256,
      dataInterpolation: true,
    }, {
      name: 'Precise equalizer',
      fragmentShaderPath: 'src/plugins/visualization/shaders/equalizer.glsl',
      fftSize: 2048,
      dataInterpolation: true,
    }, {
      name: 'Two way equalizer',
      fragmentShaderPath: 'src/plugins/visualization/shaders/twoWayEqualizer.glsl',
      fftSize: 1024,
      dataInterpolation: false,
    }, {
      name: 'Circle',
      fragmentShaderPath: 'src/plugins/visualization/shaders/circle.glsl',
      fftSize: 128,
      dataInterpolation: true,
    },
  ]
})
@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [VisualizationComponent],
  exports: [VisualizationComponent],
  providers: [
    VisualizationService,
    Commands,
    VisualizationRenderer,
  ],
})
export class Module { }
