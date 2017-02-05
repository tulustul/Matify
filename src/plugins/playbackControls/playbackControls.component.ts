import { Component } from '@angular/core';

import { AudioService, AudioState } from 'core/audio.service';

import { PlaylistService } from 'plugins/playlist';

@Component({
  selector: 'playback-controls',
  templateUrl: './playbackControls.component.html',
  styleUrls: ['./playbackControls.component.scss'],
  host: {
    'class': 'mp-primary',
  },
})
export class PlaybackControlsComponent {

  playPauseIcon = 'play_arrow';

  constructor(
    private audio: AudioService,
    private playlist: PlaylistService,
  ) {
    this.audio.state$.subscribe(state => {
      this.playPauseIcon = state === AudioState.playing ? 'pause' : 'play_arrow'
    });
  }

  togglePause() {
    if (this.audio.track) {
      this.audio.togglePause();
    } else {
      this.playlist.start();
    }
  }

}
