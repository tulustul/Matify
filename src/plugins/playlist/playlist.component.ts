import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { Theme } from 'core/theme.service';
import { VirtualRepeater } from 'core/virtualRepeater';
import { ListComponent } from 'core/list';

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
export class PlaylistComponent implements OnInit {

  playingTrack: Track;

  @ViewChild(ListComponent)
  list: ListComponent;

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
      this.list.scrollViewToItem(this.playingTrack);
    });
  }

  ngOnInit() {
    this.list.focus();
  }

  play(track: Track) {
    this.playlist.play(track);
  }

  loadOrClosePlaylist(event: MouseEvent, name: string) {
    if (event.button === 1) {
      this.closePlaylist(name);
    } else {
      this.playlist.loadByName(name);
    }
  }

  closePlaylist(name: string) {
    this.playlist.closePlaylist(name);
  }

}
