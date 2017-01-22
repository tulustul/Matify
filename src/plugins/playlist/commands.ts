import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { ModalsService } from 'core/modals';
import { NotificationsService } from 'core/notifications';
import { PaletteService } from 'core/palette';

import { PlaylistService } from './playlist.service';
import { Playlist, PlaylistTracks } from './models';

@Injectable()
export class Commands {

  constructor(
    private playlist: PlaylistService,
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
    this.playlist.create();
  }

  @Command({displayName: 'Delete playlist'})
  async deletePlaylist() {
    let name = this.playlist.playlist.name;
    let remove = await this.modals.ask(
      `Are you sure you want to delete playlist "${name}"?`,
    )
    if (remove) {
      this.playlist.remove();
    }
  }

  @Command({displayName: 'Rename playlist'})
  async renamePlaylist() {
    let newPlaylistName = await this.modals.getInput(
      'Enter new playlist name'
    );
    if (!!newPlaylistName) {
      this.playlist.rename(newPlaylistName as string)
    };
  }

  @Command({displayName: 'Load playlist'})
  async loadPlaylist() {
    let playlists = await Playlist.store.toArray();
    this.palette.openPalette(
      playlists,
      ['name'],
      playlist => this.playlist.load(playlist),
      playlist => this.playlist.load(playlist),
    );
  }

  @Command({displayName: 'Close playlist'})
  closePlaylist() {
    this.playlist.closePlaylist(this.playlist.playlist.name);
  }

  @Command({isVisibleInPallete: false})
  skipPlaylist(offset: number) {
    let playlists = this.playlist.openedPlaylists;
    let currentPlaylist = this.playlist.playlist.name;
    let index = playlists.indexOf(currentPlaylist);
    index = Math.max(0, Math.min(index + offset, playlists.length - 1));
    this.playlist.loadByName(playlists[index]);
  }

}
