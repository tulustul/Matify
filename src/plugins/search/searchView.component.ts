import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

import { Track, TracksService } from 'core/tracks';
import { FilterService } from 'core/filter.service';
import { PaneView, View } from 'core/ui/pane';

import { PlaylistService } from 'plugins/playlist';

interface SearchSerialization {
  searchTerm: string;
}

@View
@Component({
  selector: 'mp-search-view',
  templateUrl: './searchView.component.html',
  styleUrls: ['./searchView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchViewComponent implements OnInit, PaneView {

  key: string;

  filteredTracks: Track[] = [];

  tracks: Track[] = [];

  searchTerm$ = new Subject<string>();

  search$ = this.searchTerm$.debounceTime(300);

  displayName = 'Search: ';

  displayName$ = this.search$.map(term => `Search: ${term}`);

  serialization$ = this.search$.map(term => {
    return {searchTerm: term};
  });

  constructor(
    public playlist: PlaylistService,
    private changeDetectorRef: ChangeDetectorRef,
    private tracksService: TracksService,
  ) {
    playlist.tracks$.subscribe(tracks => {
      this.tracks = tracks;
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.playlist.openById(parseInt(this.key));
    this.search$.subscribe(searchTerm => this.searchTracks(searchTerm));
  }

  deserialize(data: SearchSerialization) {
    this.displayName = `Search: ${data.searchTerm}`;
    this.searchTerm$.next(data.searchTerm);
  }

  search(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  searchTracks(searchTerm) {
    this.playlist.clear();
    this.tracksService.search(searchTerm).subscribe(tracks => {
      this.playlist.addTracks(tracks);
      this.changeDetectorRef.markForCheck();
    });
  }

}
