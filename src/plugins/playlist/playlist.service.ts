import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';
import { NotificationsService } from 'core/notifications';

import { Playlist, PlaylistTracks } from './models';

interface Column {
  displayName: string,
  size: string,
  getter: (track: Track) => any,
}

@Injectable()
export class PlaylistService {

  LAST_PLAYLIST_KEY = 'mpLastPlaylist';

  OPENED_PLAYLIST_KEY = 'mpOpenedPlaylists';

  playlist: Playlist = {name: 'New playlist'};

  columns: Column[] = [
    {
      displayName: 'Track',
      size: '50px',
      getter: track => track.track,
    }, {
      displayName: 'Title',
      size: '40%',
      getter: track => track.title,
    }, {
      displayName: 'Album',
      size: '20%',
      getter: track => track.album,
    }, {
      displayName: 'Artist',
      size: '20%',
      getter: track => track.artist,
    }, {
      displayName: 'Year',
      size: '50px',
      getter: track => track.year,
    }, {
      displayName: 'Length',
      size: '50px',
      getter: track => formatSeconds(track.length),
    },
  ];

  tracks: Track[] = [];
  _tracks$ = new ReplaySubject<Track[]>(1);
  tracks$ = this._tracks$.asObservable();

  openedPlaylists: string[] = [];

  constructor(
    private audio: AudioService,
    private notifications: NotificationsService,
  ) {
    this._loadLastPlaylist();
    this._loadOpenedPlaylists();
  }

  private _loadOpenedPlaylists() {
    this.openedPlaylists = JSON.parse(
      localStorage.getItem(this.OPENED_PLAYLIST_KEY),
    ) || [];
  }

  private _loadLastPlaylist() {
    setTimeout(() => {
      let lastPlaylist = this._getLastPlaylist();
      if (!lastPlaylist) {
        this.create();
      } else if (lastPlaylist.id) {
        this.load(lastPlaylist);
      } else {
        this.playlist = lastPlaylist;
      }
    });
  }

  play(track: Track) {
    this.audio.play(track);
  }

  start() {
    if (this.tracks.length) {
      this.play(this.tracks[0]);
    }
  }

  skipTrackBy(offset: number) {
      let index = this.tracks.indexOf(this.audio.track);
      if (index === -1) {
        this.start();
      } else {
        index += offset;
        if (index < 0 ) {
          index = this.tracks.length - 1;
        } else if (index >= this.tracks.length) {
          index = 0;
        }
        this.play(this.tracks[index]);
      }
  }

  addTrack(track: Track) {
    this.addTracks([track]);
  }

  addTracks(tracks: Track[]) {
    this.tracks = this.tracks.concat(tracks);
    this._tracks$.next(this.tracks);
    this._save();
  }

  clear() {
    this.tracks = [];
    this._tracks$.next(this.tracks);
    this._save();
  }

  async load(playlist: Playlist) {
    if (playlist) {
      this.playlist = playlist;
      let playlistTracks = await PlaylistTracks.store.get(playlist.id);
      this.tracks = playlistTracks.tracks;
      this._tracks$.next(this.tracks);
      this._setLastPlaylist();
      if (this.openedPlaylists.indexOf(this.playlist.name) === -1) {
        this.openedPlaylists.push(this.playlist.name);
      }
      this._saveOpenedPlaylists();
    }
  }

  async loadByName(name: string) {
    let playlist = await this.getByName(name);
    this.load(playlist);
  }

  async rename(newName: string) {
    let existingPlaylist = await this.getByName(newName);

    if (existingPlaylist) {
      this.notifications.push({
        message: `Playlist with name ${newName} already exists`,
        type: 'error',
      });
    } else {
      let oldName = this.playlist.name;
      this.playlist.name = newName;
      await Playlist.store.update(this.playlist.id, this.playlist);

      this.notifications.push({
        message: `Renamed "${oldName}" to "${newName}"`,
      });
    }
  }

  async remove() {
    if (this.playlist.id) {
      await PlaylistTracks.store.delete(this.playlist.id);
      await Playlist.store.delete(this.playlist.id);

      this.notifications.push({
        message: `Playlist ${this.playlist.name} has been removed`,
      });

      this.create();
    }
  }

  create() {
    this.playlist = {name: 'New playlist'};
    this.tracks = [];
    this._tracks$.next(this.tracks);
    this._setLastPlaylist();
  }

  private async getByName(name: string) {
    return await Playlist.store
      .where('name')
      .equalsIgnoreCase(name)
      .first();
  }

  private _save() {
    if (!this.playlist.id) {
      this._saveNewPlaylist();
    } else {
      this._updatePlaylist();
    }
  }

  private async _saveNewPlaylist() {
    let existingPlaylist = await this.getByName(this.playlist.name);

    if (existingPlaylist) {
      this.playlist.name += ` ${Math.floor(Date.now() / 1000)}`;
    }

    this.playlist.id = await Playlist.store.add({
      name: this.playlist.name,
    });

    PlaylistTracks.store.add({
      playlistId: this.playlist.id,
      tracks: this.tracks,
    });

    this._setLastPlaylist();
  }

  private _updatePlaylist() {
    PlaylistTracks.store.update(this.playlist.id, {
      tracks: this.tracks,
    });
  }

  private _setLastPlaylist() {
    localStorage.setItem(
      this.LAST_PLAYLIST_KEY,
      JSON.stringify(this.playlist),
    );
  }

  private _getLastPlaylist() {
    return JSON.parse(localStorage.getItem(this.LAST_PLAYLIST_KEY));
  }

  closePlaylist(playlistName: string) {
    let index = this.openedPlaylists.indexOf(playlistName);
    if (index !== -1) {
      this.openedPlaylists.splice(index, 1);
      this._saveOpenedPlaylists();
      let removedCurrentPlaylist = playlistName === this.playlist.name;
      if (removedCurrentPlaylist) {
        if (this.openedPlaylists.length) {
          let newIndex = Math.min(index, this.openedPlaylists.length - 1);
          this.loadByName(this.openedPlaylists[newIndex]);
        } else {
          this.create();
        }
      }
    }
  }

  private _saveOpenedPlaylists() {
    localStorage.setItem(
      this.OPENED_PLAYLIST_KEY,
      JSON.stringify(Array.from(this.openedPlaylists)),
    );
  }

}
