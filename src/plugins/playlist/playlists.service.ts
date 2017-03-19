import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';
import { NotificationsService } from 'core/ui/notifications';

import { Playlist, PlaylistTracks } from './models';
import { PlaylistService } from './playlist.service';

interface Column {
  displayName: string;
  size: string;
  getter: (track: Track) => any;
}

@Injectable()
export class PlaylistsService {

  OPENED_PLAYLIST_KEY = 'mpOpenedPlaylists';

  LAST_PLAYLIST_KEY = 'mpLastPlaylist';

  private _openedPlaylists$ = new ReplaySubject<string[]>(1);
  openedPlaylists$ = this._openedPlaylists$.asObservable();
  openedPlaylists: string[] = [];

  constructor(
    private notifications: NotificationsService,
    private playlistService: PlaylistService,
  ) {
    this._loadOpenedPlaylists();
    this._loadLastPlaylist();
  }

  public async createPlaylist() {
    let newPlaylist = await Playlist.store
      .where('placeholder')
      .equals('1')
      .first();

    if (!newPlaylist) {
      newPlaylist = {
        name: 'New playlist',
        placeholder: '1',
      };
      newPlaylist.id = await Playlist.store.add(newPlaylist);
      await PlaylistTracks.store.add({
        playlistId: newPlaylist.id,
        tracks: [],
      });
    }
    this.playlistService.setPlaylist(newPlaylist);
    this._addToOpenedPlaylists(newPlaylist.name);
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

  public async openPlaylist(playlistName: string) {
    let playlist = await this._getByName(playlistName);
    if (playlist) {
      let playlistTracks = await PlaylistTracks.store.get(playlist.id);
      this.playlistService.setPlaylist(playlist);
      this._addToOpenedPlaylists(playlist.name);
      this._setLastPlaylist(playlist);
    }
  }

  public async closePlaylist(playlistName: string) {
    let index = this.openedPlaylists.indexOf(playlistName);
    if (index !== -1) {
      this._removeFromOpenedPlaylists(playlistName);
      let removedCurrentPlaylist = (
        playlistName === this.playlistService.playlist.name
      );
      if (removedCurrentPlaylist) {
        if (this.openedPlaylists.length) {
          let newIndex = Math.min(index, this.openedPlaylists.length - 1);
          let name = this.openedPlaylists[newIndex];
          this.openPlaylist(name);
        } else {
          this.createPlaylist();
        }
      }
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

      this._removeFromOpenedPlaylists(oldName);
      this._addToOpenedPlaylists(newName);

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

  private _addToOpenedPlaylists(playlistName: string) {
    if (this.openedPlaylists.indexOf(playlistName) === -1) {
      this.openedPlaylists.push(playlistName);
      this._saveOpenedPlaylists();
    }
  }

  private _removeFromOpenedPlaylists(playlistName: string) {
    let index = this.openedPlaylists.indexOf(playlistName);
    if (index !== -1) {
      this.openedPlaylists.splice(index, 1);
      this._saveOpenedPlaylists();
    }
  }

  private _saveOpenedPlaylists() {
    this._openedPlaylists$.next(this.openedPlaylists);
    localStorage.setItem(
      this.OPENED_PLAYLIST_KEY,
      JSON.stringify(Array.from(this.openedPlaylists)),
    );
  }

  private _loadOpenedPlaylists() {
    this.openedPlaylists = JSON.parse(
      localStorage.getItem(this.OPENED_PLAYLIST_KEY),
    ) || [];
    this._openedPlaylists$.next(this.openedPlaylists);
  }

  private _loadLastPlaylist() {
    setTimeout(() => {
      let lastPlaylist = this._getLastPlaylist();
      if (!lastPlaylist) {
        this.createPlaylist();
      } else {
        this.playlistService.setPlaylist(lastPlaylist);
      }
    });
  }

  private _getLastPlaylist() {
    return JSON.parse(localStorage.getItem(this.LAST_PLAYLIST_KEY));
  }

  private _setLastPlaylist(playlist: Playlist) {
    localStorage.setItem(
      this.LAST_PLAYLIST_KEY,
      JSON.stringify(playlist),
    );
  }



  // private _loadLastPlaylist() {
  //   setTimeout(() => {
  //     let lastPlaylist = this._getLastPlaylist();
  //     if (!lastPlaylist) {
  //       this.create();
  //     } else if (lastPlaylist.id) {
  //       this.load(lastPlaylist);
  //     } else {
  //       this.playlist = lastPlaylist;
  //       this._playlist$.next(this.playlist);
  //     }
  //   });
  // }

  // async load(playlist: Playlist) {
  //   if (playlist) {
  //     this.playlist = playlist;
  //     this._playlist$.next(this.playlist);
  //     let playlistTracks = await PlaylistTracks.store.get(playlist.id);
  //     this.tracks = playlistTracks.tracks;
  //     this._tracks$.next(this.tracks);
  //     this._setLastPlaylist();
  //     if (this.openedPlaylists.indexOf(this.playlist.name) === -1) {
  //       this.openedPlaylists.push(this.playlist.name);
  //     }
  //     this._saveOpenedPlaylists();
  //   }
  // }

  // async loadByName(name: string) {
  //   let playlist = await this.getByName(name);
  //   this.load(playlist);
  // }

  // async remove() {
  //   if (this.playlist.id) {
  //     await PlaylistTracks.store.delete(this.playlist.id);
  //     await Playlist.store.delete(this.playlist.id);

  //     this.notifications.push({
  //       message: `Playlist ${this.playlist.name} has been removed`,
  //     });

  //     this.create();
  //   }
  // }

  // create() {
  //   this.playlist = {name: 'New playlist'};
  //   this._playlist$.next(this.playlist);
  //   this.tracks = [];
  //   this._tracks$.next(this.tracks);
  //   this._setLastPlaylist();
  // }

  // private _save() {
  //   if (!this.playlist.id) {
  //     this._saveNewPlaylist();
  //   } else {
  //     this._updatePlaylist();
  //   }
  // }

  // private async _saveNewPlaylist() {
  //   let existingPlaylist = await this.getByName(this.playlist.name);

  //   if (existingPlaylist) {
  //     this.playlist.name += ` ${Math.floor(Date.now() / 1000)}`;
  //   }

  //   this.playlist.id = await Playlist.store.add({
  //     name: this.playlist.name,
  //   });

  //   PlaylistTracks.store.add({
  //     playlistId: this.playlist.id,
  //     tracks: this.tracks,
  //   });

  //   this._setLastPlaylist();
  // }

  // private _updatePlaylist() {
  //   PlaylistTracks.store.update(this.playlist.id, {
  //     tracks: this.tracks,
  //   });
  // }

  // private _setLastPlaylist() {
  //   localStorage.setItem(
  //     this.LAST_PLAYLIST_KEY,
  //     JSON.stringify(this.playlist),
  //   );
  // }

  // private _getLastPlaylist() {
  //   return JSON.parse(localStorage.getItem(this.LAST_PLAYLIST_KEY));
  // }

}
