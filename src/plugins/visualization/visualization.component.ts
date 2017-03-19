import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostBinding,
  OnInit,
} from '@angular/core';

import { AudioService, AudioState } from 'core/audio.service';
import { AudioAnalyserService } from 'core/audioAnalyser.service';

import { VisualizationService } from './visualization.service';
import { VisualizationRenderer } from './visualizationRenderer.service';

@Component({
  selector: 'mp-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationComponent implements OnInit {

  @ViewChild('canvas')
  canvas: ElementRef;

  canvasEl: HTMLCanvasElement;

  PROBES = 1024;

  HEIGHT = 250;

  @HostBinding('hidden') disabled = true;

  interval: any;

  constructor(
    private audio: AudioService,
    private equalizerVisualization: VisualizationService,
    private audioAnalyser: AudioAnalyserService,
    private renderer: VisualizationRenderer,
    private cdr: ChangeDetectorRef,
  ) {
    equalizerVisualization.enabled$.subscribe(enabled => {
      this.disabled = !enabled;
      this.cdr.markForCheck();
      if (!this.disabled) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  async ngOnInit() {
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;

    this.canvasEl.width = this.canvasEl.offsetWidth;
    this.canvasEl.height = this.HEIGHT;

    this.renderer.init(this.canvasEl);
  }

  start() {
    this.interval = setInterval(() => {
      if (!this.disabled && this.audio.state === AudioState.playing) {
        this.renderer.requestFrame(this.audioAnalyser.getData());
      }
    }, 33);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
