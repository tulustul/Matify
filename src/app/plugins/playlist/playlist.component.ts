import { Component } from '@angular/core';

import { Track } from 'app/track';
import { AudioService } from 'app/audio.service';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class PlaylistComponent {

  tracks: Track[];

  columns = [
    {
      field: 'track',
      size: '50px',
    }, {
      field: 'title',
      size: '40%',
    }, {
      field: 'album',
      size: 0,
    }, {
      field: 'artist',
      size: 0,
    }, {
      field: 'year',
      size: '50px',
    },
  ];

  constructor(private audio: AudioService) {
    this.fetchTracks();
  }

  play(track: Track) {
    this.audio.play(track);
  }

  async fetchTracks() {
    this.tracks = await Track.store.toArray();
  }

}
