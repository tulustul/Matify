import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { ModalsService } from 'core/ui/modals';
import { NotificationsService } from 'core/ui/notifications';
import { PaletteService } from 'core/ui/palette';
import { PaneService } from 'core/ui/pane';

import { PlaylistService } from './playlist.service';
import { Playlist } from './models';
import { PlaylistViewComponent } from './playlistView/playlistView.component';

@Injectable()
export class PlaylistCommands {

  constructor(
    private playlist: PlaylistService,
    private modals: ModalsService,
    private notifications: NotificationsService,
    private palette: PaletteService,
    private pane: PaneService,
  ) {}

  @Command({isVisibleInPallete: false})
  skipTrackBy(offset: number) {
    this.playlist.skipTrackBy(offset);
  }

  @Command({
    name: 'playlist.randomTrack',
    displayName: 'Randomise track',
  })
  randomTrack() {
    let newIndex = this.playlist.tracks.length * Math.random();
    newIndex = Math.round(newIndex);
    this.playlist.play(this.playlist.tracks[newIndex]);
  }

  @Command({
    name: 'playlist.clear',
    displayName: 'Clear playlist',
  })
  clearPlaylist() {
    this.playlist.clear();
  }

  @Command({
    name: 'playlist.create',
    displayName: 'New playlist',
  })
  async newPlaylist() {
    await this.playlist.create();
    this.pane.openView(PlaylistViewComponent, this.playlist.playlist.id.toString());
  }

  @Command({
    name: 'playlist.delete',
    displayName: 'Delete playlist',
  })
  async deletePlaylist() {
    const name = this.playlist.playlist.name;
    const remove = await this.modals.ask(
      `Are you sure you want to delete playlist "${name}"?`,
    );
    if (remove) {
      this.playlist.delete();
    }
  }

  @Command({
    name: 'playlist.rename',
    displayName: 'Rename playlist',
  })
  async renamePlaylist() {
    const newPlaylistName = await this.modals.getInput(
      'Enter new playlist name'
    );
    if (!!newPlaylistName) {
      this.playlist.rename(newPlaylistName as string);
    };
  }

  @Command({
    name: 'playlist.open',
    displayName: 'Open playlist',
  })
  async open() {
    const playlists = await this.playlist.getAllPlaylists();
    let playlistPreview: Playlist;
    this.palette.openPalette(
      playlists,
      ['name'],
      (playlist: Playlist) => {
        this.pane.openView(PlaylistViewComponent, playlist.id.toString());
      },
    );
  }

}
