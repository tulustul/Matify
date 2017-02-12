import { Injectable } from '@angular/core';

import { AudioService } from 'core/audio.service';

@Injectable()
export class AudioAnalyserService {

  audioContext = new AudioContext();

  analyser: AnalyserNode;

  constructor(private audio: AudioService) {
    let source = this.audioContext.createMediaElementSource(audio.audio);
    this.analyser = this.audioContext.createAnalyser();

    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getData() {
    let freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqData);
    return freqData;
  }

  set fftSize(size: number) {
    this.analyser.fftSize = size;
  }
  get fftSize() {
    return this.analyser.fftSize;
  }

}
