import { Component, HostBinding } from '@angular/core';

import { AudioService, AudioState } from 'core/audio.service';

import { PlaylistService } from 'plugins/playlist';

@Component({
  selector: 'mp-playback-controls',
  templateUrl: './playbackControls.component.html',
  styleUrls: ['./playbackControls.component.scss'],
})
export class PlaybackControlsComponent {

  STATE_ICONS = {
    [AudioState.buffering]: 'pause_circle_outline',
    [AudioState.paused]: 'play_circle_outline',
    [AudioState.playing]: 'pause_circle_outline',
    [AudioState.stopped]: 'play_circle_outline',
  };

  @HostBinding('class') cssClass = 'mp-primary';

  playPauseIcon = this.STATE_ICONS[AudioState.stopped];

  constructor(
    public audio: AudioService,
    public playlist: PlaylistService,
  ) {
    this.audio.state$.subscribe(state => {
      this.playPauseIcon = this.STATE_ICONS[state];
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
