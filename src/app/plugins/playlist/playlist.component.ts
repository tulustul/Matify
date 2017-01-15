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
