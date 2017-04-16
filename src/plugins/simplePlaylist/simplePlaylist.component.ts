import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { Track, TracksService } from 'core/tracks';
import { AudioService } from 'core/audio.service';

import { PlaylistService } from 'plugins/playlist/playlist.service';

@Component({
  selector: 'mp-simple-playlist',
  templateUrl: './simplePlaylist.component.html',
  styleUrls: ['./simplePlaylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePlaylistComponent {

  @Input()
  tracks: Track[];

  @Output()
  endReached = new EventEmitter<void>();

  @Output()
  select = new EventEmitter<Track>();

  @Output()
  playing = new EventEmitter<Track>();

  playingTrack: Track;

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
    private cdr: ChangeDetectorRef,
    private audio: AudioService,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      this.cdr.markForCheck();
    });
  }

  play(track: Track, event: Event) {
    this.playing.next(track);
    this.audio.play(track);
    event.stopPropagation();
  }

  triggerEndReached() {
    this.endReached.next(null);
  }

  selectTrack(track: Track) {
    this.select.next(track);
  }

}
