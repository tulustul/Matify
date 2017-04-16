import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';

@Component({
  selector: 'mp-track-indicator',
  templateUrl: './trackIndicator.component.html',
  styleUrls: ['./trackIndicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackIndicatorComponent {

  track: Track;

  _elapsed: number;

  _duration: number;

  _progress: number;

  constructor(
    private audio: AudioService,
    cdr: ChangeDetectorRef,
  ) {
    Observable.combineLatest(
      this.audio.track$,
      this.audio.position$,
      this.audio.duration$,
    ).subscribe(data => {
      this.track = data[0];
      this._elapsed = data[1];
      this._duration = data[2];
      cdr.markForCheck();
    });
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
