import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent {

  @Input()
  playingTrack: Track;

  constructor(
    private playlist: PlaylistService,
    private audio: AudioService,
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
