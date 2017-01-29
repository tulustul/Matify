import { Component } from '@angular/core';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';

@Component({
  selector: 'track-indicator',
  templateUrl: './trackIndicator.component.html',
  styleUrls: ['./trackIndicator.component.scss'],
})
export class TrackIndicatorComponent {

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
    return this.track ? `${this.track.title} - ${this.track.artist}` : '-';
  }

  get elapsed() {
    return formatSeconds(this._elapsed);
  }

  get duration() {
    return formatSeconds(this._duration);
  }

  get progress() {
    return Math.min((this._elapsed / this._duration * 100) || 0, 100);
  }

  seek(progress: number) {
    let position = this._duration * progress / 100;
    this.audio.seek(position);
    this._elapsed = position;
  }

}
