import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject } from 'rxjs';
import { AudioService } from 'app/audio.service';
import { Track } from 'app/track';

@Injectable()
export class PlaylistService {

  columns = [
    {
      field: 'track',
      size: '50px',
    }, {
      field: 'title',
      size: '40%',
    }, {
      field: 'album',
      size: '20%',
    }, {
      field: 'artist',
      size: '20%',
    }, {
      field: 'year',
      size: '50px',
    },
  ];

  tracks: Track[];
  _tracks$ = new ReplaySubject<Track[]>(1);
  tracks$ = this._tracks$.asObservable();

  constructor(private audio: AudioService) {
    this.fetchTracks();

    let i = 1;
    for (let column of this.columns) {
      jss.set(`playlist .cell:nth-child(${i})`, {
        width: column.size,
      });
      i++;
    }
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
