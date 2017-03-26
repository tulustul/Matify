import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { ListComponent, Column } from 'core/ui/list';

import { PlaylistService } from 'plugins/playlist/playlist.service';
import { PlaylistsService } from 'plugins/playlist/playlists.service';
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
    private playlistsService: PlaylistsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.getPlaylists();
  }

  async getPlaylists() {
    this.playlists = await this.playlistsService.getPlaylists();
    this.cdr.markForCheck();
  }

  // loadPlaylist(playlist: Playlist) {
  //   this.playlistsService.openPlaylist(playlist.name);
  // }

}
