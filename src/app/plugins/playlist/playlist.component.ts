import { Component } from '@angular/core';

import { Directive, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import { Track } from 'app/track';
import { PlaylistService } from './playlist.service';
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

  playingTrack: Track;

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

  constructor(
    private playlist: PlaylistService,
    private audio: AudioService,
) {
  audio.track$.subscribe(track => this.playingTrack = track);
}

  play(track: Track) {
    this.playlist.play(track);
  }

}
