import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { ModalsService } from 'core/ui/modals';
import { NotificationsService } from 'core/ui/notifications';
import { PaletteService } from 'core/ui/palette';
import { PaneService } from 'core/ui/pane';

import { PlaylistService } from './playlist.service';
import { PlaylistsService, PlaylistWithTracks } from './playlists.service';
import { Playlist, PlaylistTracks } from './models';
import { PlaylistComponent } from './playlist.component';

@Injectable()
export class PlaylistCommands {

  constructor(
    private playlist: PlaylistService,
    private playlists: PlaylistsService,
    private modals: ModalsService,
    private notifications: NotificationsService,
    private palette: PaletteService,
    private pane: PaneService,
  ) {}

  @Command({isVisibleInPallete: false})
  skipTrackBy(offset: number) {
    this.playlist.skipTrackBy(offset);
  }

  @Command({displayName: 'Randomise track'})
  randomTrack() {
    let newIndex = this.playlist.tracks.length * Math.random();
    newIndex = Math.round(newIndex);
    this.playlist.play(this.playlist.tracks[newIndex]);
  }

  @Command({displayName: 'Clear playlist'})
  clearPlaylist() {
    this.playlist.clear();
  }

  @Command({displayName: 'New playlist'})
  async newPlaylist() {
    await this.playlists.createPlaylist();
    const playlistView = this.pane.openNewView(PlaylistComponent) as PlaylistComponent;
        playlistView.setPlaylist(this.playlist.playlist.name);
  }

  @Command({displayName: 'Delete playlist'})
  async deletePlaylist() {
    const name = this.playlist.playlist.name;
    const remove = await this.modals.ask(
      `Are you sure you want to delete playlist "${name}"?`,
    );
    if (remove) {
      this.playlists.deletePlaylist(this.playlist.playlist.name);
    }
  }

  @Command({displayName: 'Rename playlist'})
  async renamePlaylist() {
    const newPlaylistName = await this.modals.getInput(
      'Enter new playlist name'
    );
    if (!!newPlaylistName) {
      this.playlists.renamePlaylist(
        this.playlist.playlist, newPlaylistName as string,
      );
    };
  }

  @Command({displayName: 'Open playlist'})
  async openPlaylist() {
    const playlists = await Playlist.store.toArray();
    let playlistPreview: Playlist;
    this.palette.openPalette(
      playlists,
      ['name'],
      async (playlist: Playlist) => {
        const playlistView = (
          this.pane.openNewView(PlaylistComponent) as PlaylistComponent
        );
        playlistView.setPlaylist(playlist.name);
      },
    );
  }

}
