import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Track } from 'core/tracks';
import { FilterService } from 'core/filter.service';
import { PaneView, View} from 'core/ui/pane';

import { PlaylistService } from '../playlist.service';

@View
@Component({
  selector: 'mp-playlist-view',
  templateUrl: './playlistView.component.html',
  styleUrls: ['./playlistView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistViewComponent implements OnInit, PaneView {

  key: string;

  filteredTracks: Track[] = [];

  tracks: Track[] = [];

  displayName$: Observable<string>;

  constructor(
    public playlist: PlaylistService,
    private filterService: FilterService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.displayName$ = playlist.playlist$.map(
      playlist => playlist.name
    );

    playlist.tracks$.subscribe(tracks => {
      this.tracks = tracks;
      this.filteredTracks = this.tracks;
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.playlist.openById(parseInt(this.key));
  }

  search(searchTerm: string) {
    this.filteredTracks = this.filterService.filter(
      searchTerm, this.playlist.tracks, ['title', 'album', 'artist'],
    );
    this.changeDetectorRef.markForCheck();
  }

}
