import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { ipcRenderer } from 'electron';

import { AudioAnalyserService } from 'core/audioAnalyser.service';
import { Settings } from 'core/settings.service';
import { PLUGGINS_DATA } from 'core/plugging';

import { Visualization } from './visualization.interface';
import { VisualizationRenderer } from './visualizationRenderer.service';

@Injectable()
export class VisualizationService {

  private _enabled$ = new ReplaySubject<boolean>();
  enabled$ = this._enabled$.asObservable();
  _enabled = false;

  private _visualization$ = new ReplaySubject<Visualization>();
  visualization$ = this._visualization$.asObservable();
  _visualization = null;

  globallyEnabled = true;

  visualizationsMap = new Map<string, Visualization>();

  constructor(
    settings: Settings,
    private audioAnalyser: AudioAnalyserService,
    private renderer: VisualizationRenderer,
  ) {
    for (let vis  of PLUGGINS_DATA.visualizations) {
      this.visualizationsMap.set(vis.name, vis);
    }

    settings.changes$.subscribe(newSettings => {
      let visName = newSettings.visualization;
      if (visName) {
        if (!this.visualizationsMap.has(visName)) {
          console.error(`Unknown visualization: ${visName}`);
        } else {
          this.visualization = this.visualizationsMap.get(visName);
        }
      }
    });

    ipcRenderer.on('hide', () => this.enabled = false);
    ipcRenderer.on('show', () => this.enabled = true);
  }

  set enabled(enabled: boolean) {
    if (this.globallyEnabled) {
      this._enabled = enabled;
      this._enabled$.next(this.enabled);
    }
  }
  get enabled() {
    return this._enabled;
  }

  toogle() {
    this.globallyEnabled = !this.globallyEnabled;
    this._enabled = this.globallyEnabled;
    this._enabled$.next(this.enabled);
  }

  set visualization(visualization: Visualization) {
    visualization.fftSize = visualization.fftSize || 2048;
    visualization.dataInterpolation = visualization.dataInterpolation;

    this._visualization = visualization;
    this._visualization$.next(this._visualization);

    this.audioAnalyser.fftSize = visualization.fftSize;
    this.renderer.setShader(visualization.fragmentShaderPath);
    this.renderer.dataInterpolation = visualization.dataInterpolation;
  }
  get visualization() {
    return this._visualization;
  }

}
