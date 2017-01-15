import { Component } from '@angular/core';

import { AudioService, AudioState } from 'app/audio.service';
import { PlaylistService } from 'app/plugins/playlist';

@Component({
  selector: 'playback-controls',
  templateUrl: './playbackControls.component.html',
  styleUrls: ['./playbackControls.component.scss'],
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
