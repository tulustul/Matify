import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { AudioService, AudioState } from 'core/audio.service';

import { EqualizerVisualizationService } from './equalizerVisualization.service';

@Component({
  selector: 'equalizer-visualization',
  templateUrl: './equalizerVisualization.component.html',
  styleUrls: ['./equalizerVisualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[hidden]': '!enabled',
  }
})
export class EqualizerVisualizationComponent {

  audioContext = new AudioContext();

  analyser: AnalyserNode;

  @ViewChild('canvas')
  canvas: ElementRef;

  canvasEl: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  PROBES = 200;

  HEIGHT = 250;

  enabled = false;

  interval: number;

  constructor(
    private audio: AudioService,
    private cdr: ChangeDetectorRef,
    private equalizerVisualization: EqualizerVisualizationService,
  ) {
    document.querySelector('audio');
    let source = this.audioContext.createMediaElementSource(audio.audio);
    this.analyser = this.audioContext.createAnalyser();

    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    equalizerVisualization.enabled$.subscribe(enabled => {
      this.enabled = enabled;
      this.cdr.markForCheck();
      if (this.enabled) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  ngOnInit() {
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.PROBES;
    this.canvasEl.height = this.HEIGHT;
  }

  start() {
    this.interval = setInterval(() => {
      if (this.enabled && this.audio.state === AudioState.playing) {
        var freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqData);

        let step = Math.floor(freqData.length / this.PROBES);
        let width = this.canvasEl.offsetWidth;
        let height = this.canvasEl.offsetHeight;

        this.ctx.clearRect(0, 0, this.PROBES, this.HEIGHT);

        let x = 0;
        for (var i = 0; i < freqData.length; i += step ) {
          this.ctx.fillRect(x, this.HEIGHT, 1, -freqData[i]);
          x++;
        }
      }
    }, 33);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
