import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Track } from 'app/track';
import { PlaylistService } from './playlist.service';
import { AudioService } from 'app/audio.service';
import { Theme } from 'app/theme.service';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent {

  playingTrack: Track;

  constructor(
    private playlist: PlaylistService,
    private audio: AudioService,
    private theme: Theme,
    private sanitizer: DomSanitizer,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      changeDetectorRef.markForCheck();
    });
  }

  play(track: Track) {
    this.playlist.play(track);
  }

}
