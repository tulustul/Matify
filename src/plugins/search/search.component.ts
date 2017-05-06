import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { Track, TrackContainer, TracksService } from 'core/tracks';

import { PlaylistCommands } from 'plugins/playlist';

import { SearchService } from './search.service';

@Component({
  selector: 'mp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {

  SEARCH_TYPES = [
    'tracks',
    'albums',
  ];

  searchType = 'albums';

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
    const search$ = this.searchFormControl.valueChanges.debounceTime(600);

    search$.subscribe(searchTerm => {
      this.search(searchTerm);
    });
  }

  search(searchTerm, page=0) {
    this.page = page;
    this.waiting = true;
    this.cdr.markForCheck();
    this.searchService.searchTerm = searchTerm;
    if (page === 0) {
      this.searchService.tracks = [];
      this.searchService.trackContainers = [];
    }

    let tracks$: Observable<Track[]> = Observable.empty();
    let trackContainers$: Observable<TrackContainer[]> = Observable.empty();

    if (this.searchType === 'tracks') {
      tracks$ = this.tracksService.search(searchTerm, this.page);
      tracks$.subscribe(tracks => {
        this.searchService.tracks = (
          this.searchService.tracks.concat(tracks)
        );
      });
    } else if (this.searchType === 'albums') {
      trackContainers$ = this.tracksService.searchAlbums(searchTerm, this.page);
      trackContainers$.subscribe(trackContainers => {
        this.searchService.trackContainers = (
          this.searchService.trackContainers.concat(trackContainers)
        );
      });
    }

    tracks$.combineLatest(trackContainers$).subscribe(() => {
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

  searchBy(searchType: string) {
    this.searchType = searchType;
    if (this.searchService.searchTerm) {
      this.search(this.searchService.searchTerm);
    }
  }

  get haveResults() {
    return (
      this.searchService.tracks.length > 0 ||
      this.searchService.trackContainers.length > 0
    );
  }

}
