import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject, Observable } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';
import { NotificationsService } from 'core/ui/notifications';

import { Playlist, PlaylistTracks } from './models';
import { PlaylistService } from './playlist.service';

export interface PlaylistWithTracks {
  name: string;
  tracks: Track[];
  playlistModel: Playlist;
  tracksModel: PlaylistTracks;
}

interface Column {
  displayName: string;
  size: string;
  getter: (track: Track) => any;
}

@Injectable()
export class PlaylistsService {

  private _playlists = new Map<number, ReplaySubject<PlaylistWithTracks>>();

  constructor(
    private notifications: NotificationsService,
    private playlistService: PlaylistService,
  ) {}

  public async createPlaylist() {
    let newPlaylist = await Playlist.store
      .where('placeholder')
      .equals('1')
      .first();

    if (!newPlaylist) {
      newPlaylist = {
        id: null,
        name: 'New playlist',
        placeholder: '1',
      };
      newPlaylist.id = await Playlist.store.add(newPlaylist);
      await PlaylistTracks.store.add({
        playlistId: newPlaylist.id,
        tracks: [],
      });
    }
    // this.playlistService.setPlaylist(newPlaylist);
  }

  public async deletePlaylist(playlistName: string) {
    let playlist = await this._getByName(playlistName);

    await PlaylistTracks.store.delete(playlist.id);
    await Playlist.store.delete(playlist.id);

    this.notifications.push({
      message: `Playlist ${playlist.name} has been removed`,
    });

    this.createPlaylist();
  }

  // public async openPlaylist(playlistName: string) {
  //   let playlist = await this._getByName(playlistName);
  //   if (playlist) {
  //     let playlistTracks = await PlaylistTracks.store.get(playlist.id);
  //     await this.playlistService.setPlaylist(playlist);
  //   }
  // }

  public async getPlaylist(playlistName: string) {
    const playlist = await this._getByName(playlistName);
    if (playlist) {
      const playlistTracks = await PlaylistTracks.store.get(playlist.id);
      const playlistWithTracks: PlaylistWithTracks = {
        name: playlist.name,
        tracks: playlistTracks.tracks,
        playlistModel: playlist,
        tracksModel: playlistTracks,
      };
      let playlist$ = this._playlists.get(playlist.id);
      if (!playlist$) {
        playlist$ = new ReplaySubject(1);
        this._playlists.set(playlist.id, playlist$);
      }
      playlist$.next(playlistWithTracks);
      // return playlistWithTracks;
      return playlist$;
    }
  }

  public async renamePlaylist(playlist: Playlist, newName: string) {
    let existingPlaylist = await this._getByName(newName);

    if (existingPlaylist) {
      this.notifications.push({
        message: `Playlist with name "${newName}" already exists`,
        type: 'error',
      });
    } else {
      let oldName = playlist.name;
      playlist.name = newName;
      playlist.placeholder = '';
      await Playlist.store.update(playlist.id, playlist);

      this.notifications.push({
        message: `Renamed "${oldName}" to "${newName}"`,
        type: 'success',
      });
    }
  }

  public getPlaylists() {
     return Playlist.store.toArray();
  }

  private async _getByName(name: string) {
    return await Playlist.store
      .where('name')
      .equalsIgnoreCase(name)
      .first();
  }

}
