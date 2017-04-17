import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable,  } from 'rxjs';

import { Track, TracksService } from 'core/tracks';

import { PlaylistCommands } from 'plugins/playlist';

import { SearchService } from './search.service';

@Component({
  selector: 'mp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {

  waiting = false;

  loadMore = false;

  page = 0;

  searchFormControl = new FormControl();

  constructor(
    private tracksService: TracksService,
    private playlistCommands: PlaylistCommands,
    public searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {
    const search$ = this.searchFormControl.valueChanges.debounceTime(300);

    search$.subscribe(searchTerm => {
      this.search(searchTerm);
    });
  }

  search(searchTerm, page=0) {
    this.page = page;
    this.waiting = true;
    this.searchService.searchTerm = searchTerm;
    if (page === 0) {
      this.searchService.tracks = [];
    }

    this.tracksService.search(searchTerm, this.page).subscribe(
      tracks => {
        this.searchService.tracks = (
          this.searchService.tracks.concat(tracks)
        );
        this.cdr.markForCheck();
      },
      () => {},
      () => {
        this.waiting = false;
        if (this.loadMore) {
          this.searchMore();
        }
        this.cdr.markForCheck();
      },
    );
  }

  searchMore() {
    if (this.waiting) {
      this.loadMore = true;
    } else {
      this.search(this.searchService.searchTerm, this.page + 1);
    }
  }

  addToPlaylist(track: Track) {
    this.removeTrackFromResults(track);
    this.playlistCommands.addTrack(Object.assign({}, track));
  }

  addAllToPlaylist() {
    this.playlistCommands.addTracks(this.searchService.tracks);
  }

  removeTrackFromResults(track: Track) {
    const trackIndex = this.searchService.tracks.indexOf(track);
    if (trackIndex !== -1) {
      this.searchService.tracks.splice(trackIndex, 1);
    }
    this.searchService.tracks = this.searchService.tracks.slice();
    this.cdr.markForCheck();
  }

}
