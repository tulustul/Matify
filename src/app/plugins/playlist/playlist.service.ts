import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject } from 'rxjs';
import { AudioService } from 'app/audio.service';
import { Track } from 'app/track';
import { formatSeconds } from 'app/utils';

interface Column {
  displayName: string,
  size: string,
  getter: (track: Track) => any,
}

@Injectable()
export class PlaylistService {

  columns: Column[] = [
    {
      displayName: 'Track',
      size: '50px',
      getter: track => track.track,
    }, {
      displayName: 'Title',
      size: '40%',
      getter: track => track.title,
    }, {
      displayName: 'Album',
      size: '20%',
      getter: track => track.album,
    }, {
      displayName: 'Artist',
      size: '20%',
      getter: track => track.artist,
    }, {
      displayName: 'Year',
      size: '50px',
      getter: track => track.year,
    }, {
      displayName: 'Length',
      size: '50px',
      getter: track => formatSeconds(track.length),
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
