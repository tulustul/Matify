import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { ListComponent, Column } from 'core/list';

import { PlaylistService } from 'plugins/playlist/playlist.service';
import { Playlist } from 'plugins/playlist/models';

@Component({
  selector: 'playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistsComponent {

  columns: Column[] = [
    {getter: (item: Playlist) => item.name},
  ];

  playlists: Playlist[] = [];

  @ViewChild(ListComponent)
  list: ListComponent;

  constructor(
    private playlist: PlaylistService,
    private cdr: ChangeDetectorRef,
  ) {
    this.getPlaylists();
  }

  async getPlaylists() {
    this.playlists = await Playlist.store.toArray();
    this.cdr.markForCheck();
  }

  loadPlaylist(playlist: Playlist) {
    this.playlist.load(playlist);
  }

}
