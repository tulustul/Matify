import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Track } from 'app/track';
import { PlaylistService } from './playlist.service';
import { AudioService } from 'app/audio.service';
import { Theme } from 'app/theme.service';
import { VirtualRepeater } from 'app/virtualRepeater';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  host: {
    '[hidden]': '!opened',
    'class': 'mp-panel',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent {

  playingTrack: Track;

  @ViewChild(VirtualRepeater)
  repeater: VirtualRepeater;

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
      this.scrollViewToTrack();
    });
  }

  play(track: Track) {
    this.playlist.play(track);
  }

  scrollViewToTrack() {
    let index = this.playlist.tracks.indexOf(this.playingTrack);
    if (index !== -1) {
      this.repeater.scrollTo(index);
    }
  }

}
