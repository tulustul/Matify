import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';
import { AudioService } from 'app/audio.service';
import { Track } from 'app/track';

@Injectable()
export class PlaylistService {

  tracks: Track[];
  _tracks$ = new ReplaySubject<Track[]>(1);
  tracks$ = this._tracks$.asObservable();

  constructor(private audio: AudioService) {
    this.fetchTracks();
  }

  play(track: Track) {
    this.audio.play(track);
  }

  start() {
    if (this.tracks.length) {
      this.play(this.tracks[0]);
    }
  }

  async fetchTracks() {
    this.tracks = await Track.store.toArray();
    this._tracks$.next(this.tracks);
  }

  skipTrackBy(offset: number) {
      let index = this.tracks.indexOf(this.audio.track);
      if (index === -1) {
        this.start();
      } else {
        index += offset;
        if (index < 0 ) {
          index = this.tracks.length - 1;
        } else if (index >= this.tracks.length) {
          index = 0;
        }
        this.play(this.tracks[index]);
      }
  }

}
