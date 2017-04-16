import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';

@Plugin({
  visualizations: [
    {
      name: 'Column equalizer',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/equalizer.glsl',
      fftSize: 512,
      dataInterpolation: false,
    }, {
      name: 'Sparse column equalizer',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/equalizer.glsl',
      fftSize: 64,
      dataInterpolation: false,
    }, {
      name: 'Smooth equalizer',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/equalizer.glsl',
      fftSize: 256,
      dataInterpolation: true,
    }, {
      name: 'Precise equalizer',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/equalizer.glsl',
      fftSize: 2048,
      dataInterpolation: true,
    }, {
      name: 'Two way equalizer',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/twoWayEqualizer.glsl',
      fftSize: 1024,
      dataInterpolation: false,
    }, {
      name: 'Circle',
      fragmentShaderPath: 'src/plugins/basicVisualizations/shaders/circle.glsl',
      fftSize: 128,
      dataInterpolation: true,
    },
  ]
})
@NgModule()
export class Module { }
