import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { AudioService, AudioState } from 'app/audio.service';
import { Track } from 'app/track';
import { formatSeconds } from 'app/utils';
import { PlaylistService } from 'app/plugins/playlist';

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

  playPauseIcon = 'play_arrow';

  constructor(
    private audio: AudioService,
    private playlist: PlaylistService,
  ) {
    this.audio.track$.subscribe(track => this.track = track);
    this.audio.position$.subscribe(elapsed => this._elapsed = elapsed);
    this.audio.duration$.subscribe(duration => this._duration = duration);

    this.audio.state$.subscribe(state => {
      this.playPauseIcon = state === AudioState.playing ? 'pause' : 'play_arrow'
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
    return (this._elapsed / this._duration * 100);
  }

  seek(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let position = this._duration * event.offsetX / target.clientWidth;
    this.audio.seek(position);
    this._elapsed = position;
  }

  togglePause() {
    if (this.audio.track) {
      this.audio.togglePause();
    } else {
      this.playlist.start();
    }
  }

}

