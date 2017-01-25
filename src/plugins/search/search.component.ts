import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Track, TracksService } from 'core/tracks';

import { PlaylistService } from 'plugins/playlist/playlist.service';

import { SearchService } from './search.service';

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

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {}

  search() {
    this.waiting = true;
    this.searchService.tracks = [];

    this.tracksService.search(this.searchService.searchTerm).subscribe(
      tracks => {
        this.searchService.tracks = (
          this.searchService.tracks.concat(tracks)
        );
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
    this.playlist.addTracks(this.searchService.tracks);
  }

}
