import { Component, HostBinding } from '@angular/core';

import { AudioService, AudioState } from 'core/audio.service';

import { PlaylistService } from 'plugins/playlist';

@Component({
  selector: 'mp-playback-controls',
  templateUrl: './playbackControls.component.html',
  styleUrls: ['./playbackControls.component.scss'],
})
export class PlaybackControlsComponent {

  @HostBinding('class') cssClass = 'mp-primary';

  playPauseIcon = 'play_circle_outline';

  constructor(
    public audio: AudioService,
    public playlist: PlaylistService,
  ) {
    this.audio.state$.subscribe(state => {
      this.playPauseIcon = state === AudioState.playing ?
        'pause_circle_outline' : 'play_circle_outline';
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
