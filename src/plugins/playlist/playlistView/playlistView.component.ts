import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Track } from 'core/tracks';
import { PaneView } from 'core/ui/pane';
import { View } from 'core/ui/pane/view.decorator';

import { PlaylistService } from '../playlist.service';
import { PlaylistComponent } from '../playlist/playlist.component';

@View
@Component({
  selector: 'mp-playlist-view',
  templateUrl: './playlistView.component.html',
  styleUrls: ['./playlistView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistViewComponent implements OnInit, OnDestroy, PaneView {

  @ViewChild(PlaylistComponent)
  private playlistComponent: PlaylistComponent;

  key: string;

  filteredTracks: Track[] = [];

  tracks: Track[] = [];

  displayName$: Observable<string>;

  constructor(
    public playlist: PlaylistService,
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

  ngOnDestroy() {
    this.playlist.playlist = null;
  }

  search(searchTerm: string) {
    this.playlistComponent.list.itemsManager.search(searchTerm);
  }

}
