import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Track, TracksService } from 'core/tracks';

import { PlaylistService } from 'plugins/playlist/playlist.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {

  waiting = false;

  searchTerm: string;

  tracks: Track[] = [];

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
    private cdr: ChangeDetectorRef,
  ) {}

  search() {
    this.waiting = true;
    this.tracks = [];

    this.tracksService.search(this.searchTerm).subscribe(
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

  addAllToPlaylist() {
    this.playlist.addTracks(this.tracks);
  }

}
