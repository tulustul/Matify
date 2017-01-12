import { Component } from '@angular/core';

import { AudioService } from 'app/audio.service';
import { Track } from 'app/track';
import { formatSeconds } from 'app/utils';

@Component({
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent {

  track: Track;

  _elapsed: number;

  _duration: number;

  _progress: number;

  constructor(private audio: AudioService) {
    this.audio.track$.subscribe(track => this.track = track);
    this.audio.position$.subscribe(elapsed => this._elapsed = elapsed);
    this.audio.duration$.subscribe(duration => this._duration = duration);
  }

  get trackName() {
    return this.track ? this.track.title : '-';
  }

  get elapsed() {
    return formatSeconds(this._elapsed);
  }

  get duration() {
    return formatSeconds(this._duration);
  }

  get progress() {
    return (this._elapsed / this._duration * 100);
  }

}

