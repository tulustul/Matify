import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable,  } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track, TracksService } from 'core/tracks';

import { PlaylistService } from 'plugins/playlist/playlist.service';

@Component({
  selector: 'mp-similar-tracks',
  templateUrl: './similarTracks.component.html',
  styleUrls: ['./similarTracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimilarTracksComponent {

  waiting = false;

  loadMore = false;

  tracks: Track[] = [];

  track: Track;

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
    private audio: AudioService,
    private cdr: ChangeDetectorRef,
  ) {
    this.audio.track$.subscribe(track => {
      this.track = track;
      this.findSimilar(track);
    });
  }

  findSimilar(track: Track) {
    this.tracks = [];
    this.waiting = true;

    this.tracksService.findSimilar(track).subscribe(
      tracks => {
        this.tracks = this.tracks.concat(tracks);
        this.cdr.markForCheck();
      },
      () => {},
      () => {
        this.waiting = false;
        this.cdr.markForCheck();
      },
    );
  }

  addToPlaylist(track: Track) {
    this.playlist.addTrack(Object.assign({}, track));
  }

}
