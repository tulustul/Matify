import { Component } from '@angular/core';

import { Track } from 'app/plugins/track';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class PlaylistComponent {

  audio: HTMLAudioElement;

  tracks: Track[];

  columns = [
    'track',
    'title',
    'album',
    'artist',
    'year',
  ];

  constructor() {
    this.tracks = JSON.parse(localStorage.getItem('tracks')) || [];

    this.audio = new Audio();
  }

  play(track: Track) {
    this.audio.src = track.uri;
    this.audio.load();
    this.audio.play();
  }

}
