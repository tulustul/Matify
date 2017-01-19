import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { AudioService } from 'core/audio.service';

import { PlaylistService } from 'plugins/playlist';

@Injectable()
export class TrackSchedulerService {

  constructor(
    private audio: AudioService,
    private playlist: PlaylistService,
  ) {
    this.audio.trackend$.subscribe(() => {
      this.playlist.skipTrackBy(1);
    });
  }

}
