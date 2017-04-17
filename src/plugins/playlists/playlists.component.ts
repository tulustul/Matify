import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { ListComponent, Column } from 'core/ui/list';
import { PaneService } from 'core/ui/pane';

import {
  PlaylistService,
  Playlist,
} from 'plugins/playlist';
import {
  PlaylistViewComponent,
} from 'plugins/playlist/playlistView/playlistView.component';

@Component({
  selector: 'mp-playlists',
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
    public playlistService: PlaylistService,
    public pane: PaneService,
    private cdr: ChangeDetectorRef,
  ) {
    this.getPlaylists();
  }

  async getPlaylists() {
    this.playlists = await this.playlistService.getAllPlaylists();
    this.cdr.markForCheck();
  }

  loadPlaylist(playlist: Playlist) {
    this.pane.openView(PlaylistViewComponent, playlist.id.toString());
  }

  async delete(playlist: Playlist) {
    await this.playlistService.deletePlaylist(playlist);
    this.getPlaylists();
  }

}
