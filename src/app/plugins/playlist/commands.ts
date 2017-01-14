import { Injectable } from '@angular/core';

import { Command } from 'app/commands';
import { PlaylistService } from './playlist.service';

@Injectable()
export class Commands {

  constructor(private playlist: PlaylistService) {}

  @Command()
  skipTrackBy(offset: number) {
    this.playlist.skipTrackBy(offset);
  }

  @Command()
  randomTrack() {
    let newIndex = this.playlist.tracks.length * Math.random();
    newIndex = Math.round(newIndex);
    this.playlist.play(this.playlist.tracks[newIndex]);
  }

}
