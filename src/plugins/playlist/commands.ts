import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { ModalsService } from 'core/modals';
import { NotificationsService } from 'core/notifications';
import { PaletteService } from 'core/palette';

import { PlaylistService } from './playlist.service';
import { PlaylistsService } from './playlists.service';
import { Playlist, PlaylistTracks } from './models';

@Injectable()
export class PlaylistCommands {

  constructor(
    private playlist: PlaylistService,
    private playlists: PlaylistsService,
    private modals: ModalsService,
    private notifications: NotificationsService,
    private palette: PaletteService,
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
  newPlaylist() {
    this.playlists.createPlaylist();
  }

  @Command({displayName: 'Delete playlist'})
  async deletePlaylist() {
    let name = this.playlist.playlist.name;
    let remove = await this.modals.ask(
      `Are you sure you want to delete playlist "${name}"?`,
    )
    if (remove) {
      this.playlists.deletePlaylist(this.playlist.playlist.name);
    }
  }

  @Command({displayName: 'Rename playlist'})
  async renamePlaylist() {
    let newPlaylistName = await this.modals.getInput(
      'Enter new playlist name'
    );
    if (!!newPlaylistName) {
      this.playlists.renamePlaylist(
        this.playlist.playlist, newPlaylistName as string,
      );
    };
  }

  @Command({displayName: 'Load playlist'})
  async loadPlaylist() {
    let playlists = await Playlist.store.toArray();
    let playlistPreview: Playlist;
    let originallyOpened = this.playlists.openedPlaylists.splice(0);
    this.palette.openPalette(
      playlists,
      ['name'],
      (playlist: Playlist) => this.playlists.openPlaylist(playlist.name),
      (playlist: Playlist) => {
        if (playlistPreview && originallyOpened.indexOf(playlistPreview.name) === -1) {
          this.playlists.closePlaylist(playlistPreview.name);
        }
        playlistPreview = playlist;
        this.playlists.openPlaylist(playlist.name);
      },
    );
  }

  @Command({displayName: 'Close playlist'})
  closePlaylist() {
    this.playlists.closePlaylist(this.playlist.playlist.name);
  }

  @Command({isVisibleInPallete: false})
  skipPlaylist(offset: number) {
    let playlists = this.playlists.openedPlaylists;
    let currentPlaylist = this.playlist.playlist.name;
    let index = playlists.indexOf(currentPlaylist);
    index = Math.max(0, Math.min(index + offset, playlists.length - 1));
    this.playlists.openPlaylist(playlists[index]);
  }

  @Command({isVisibleInPallete: false})
  searchPlaylist() {
    this.playlist.focusSearch();
  }

}
