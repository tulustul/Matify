import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { Theme } from 'core/theme.service';
import { VirtualRepeater } from 'core/virtualRepeater';

import { PlaylistService } from './playlist.service';

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
