import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { ListComponent, Column } from 'core/ui/list';

import { PlaylistService } from 'plugins/playlist/playlist.service';
import { Playlist } from 'plugins/playlist/models';

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
    private cdr: ChangeDetectorRef,
  ) {
    this.getPlaylists();
  }

  async getPlaylists() {
    this.playlists = await this.playlistService.getAllPlaylists();
    this.cdr.markForCheck();
  }

  loadPlaylist(playlist: Playlist) {
    this.playlistService.open(playlist.name);
  }

}
