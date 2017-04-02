import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  Input,
  OnInit,
} from '@angular/core';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { ListComponent } from 'core/ui/list';

import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'mp-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit {

  playingTrack: Track;

  @Input() tracks: Track[] = [];

  @ViewChild(ListComponent)
  list: ListComponent;

  constructor(
    public playlist: PlaylistService,
    private audio: AudioService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      if (this.list) {
        this.list.scrollViewToItem(this.playingTrack);
      }
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.list.focus();
  }

  play(track: Track) {
    this.playlist.play(track);
  }

  tracksEqual(trackA: Track, trackB: Track) {
    if (trackA && trackB) {
      return trackA.uri === trackB.uri;
    }
  }

}
