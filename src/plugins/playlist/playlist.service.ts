import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject, Observable } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { LibraryService } from 'core/library.service';
import { formatSeconds } from 'core/utils';
import { NotificationsService } from 'core/ui/notifications';
import { Column } from 'core/ui/list';

import { Playlist, PlaylistTracks } from './models';

@Injectable()
export class PlaylistService {

  private _playlist$ = new ReplaySubject<Playlist>(1);
  playlist$ = this._playlist$.asObservable();
  playlist: Playlist;

  playlistTracks: PlaylistTracks;
  tracks: Track[] = [];
  private _tracks$ = new ReplaySubject<Track[]>(1);
  tracks$ = this._tracks$.asObservable();

  private _searchFocus$ = new ReplaySubject<void>(1);
  searchFocus$ = this._searchFocus$.asObservable();

  columns: Column<Track>[] = [
    {
      displayName: 'Track',
      size: '75px',
      getter: track => track.track,
      sortGetter: track => track.track,
    }, {
      displayName: 'Title',
      size: '40%',
      getter: track => track.title,
      sortGetter: track => track.title.toLocaleLowerCase(),
    }, {
      displayName: 'Album',
      size: '20%',
      getter: track => track.album,
      sortGetter: track => track.album.toLocaleLowerCase(),
    }, {
      displayName: 'Artist',
      size: '20%',
      getter: track => track.artist,
      sortGetter: track => track.artist.toLocaleLowerCase(),
    }, {
      displayName: 'Year',
      size: '75px',
      getter: track => track.year,
      sortGetter: track => track.year,
    }, {
      displayName: 'Length',
      size: '85px',
      getter: track => formatSeconds(track.length),
      sortGetter: track => track.length,
    }, {
      displayName: 'Rank',
      size: '75px',
      getter: track => track.rank ? track.rank.toFixed(1) : '',
      sortGetter: track => track.rank,
    },
  ];

  constructor(
    private audio: AudioService,
    private notifications: NotificationsService,
    private library: LibraryService,
  ) {
    this._tracks$.next([]);
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

  async addTracks(tracks: Track[]) {
    await this.library.bulkAddTracks(tracks);
    this.updateTracks(this.tracks.concat(tracks));
  }

  clear() {
    this.updateTracks([]);
  }

  public updateTracks(tracks: Track[]) {
    this.tracks = tracks;
    this._tracks$.next(this.tracks.slice());
    this._save();
  }

  private async _save() {
    if (this.playlist.placeholder === 1) {
      this.playlist.placeholder = 0;
      this.playlist.name = this.guessPlaylistName(this.playlist, this.tracks);
      await Playlist.store.update(this.playlist.id, this.playlist);
      this._playlist$.next(this.playlist);
    }
    await PlaylistTracks.store.update(this.playlist.id, {
      trackUris: this.tracks.map(t => t.uri),
    });
  }

  private guessPlaylistName(playlist: Playlist, tracks: Track[]) {
    if (tracks.length) {
      const t = tracks[0];
      return t.album || t.artist || t.title || playlist.name;
    } else {
      return playlist.name;
    }
  }

  public async create(name='New playlist', persistent=true) {
    this.playlist = {
      name: name + await Playlist.store.count(),
      placeholder: 1,
      persistent: persistent ? 1 : 0,
    };
    this.tracks = [];
    this.playlist.id = await Playlist.store.add(this.playlist);
    this.playlistTracks = {
      playlistId: this.playlist.id,
      trackUris: [],
    };
    await PlaylistTracks.store.add(this.playlistTracks);

    this._tracks$.next(this.tracks);
    this._playlist$.next(this.playlist);
  }

  public async delete() {
    this.deletePlaylist(this.playlist);
  }

  public async deletePlaylist(playlist: Playlist) {
    await PlaylistTracks.store.delete(playlist.id);
    await Playlist.store.delete(playlist.id);

    this.notifications.push({
      message: `Playlist ${playlist.name} has been removed`,
    });
  }

  public async open(playlistName: string) {
    this._open(await this._getByName(playlistName));
  }

  public async openById(id: number) {
    this._open(await this._getById(id));
  }

  private async _open(playlist: Playlist) {
    this.playlist = playlist;
    if (this.playlist) {
      this.playlistTracks = await PlaylistTracks.store.get(this.playlist.id);
      this.tracks = await this.library.getTracksByUris(
        this.playlistTracks.trackUris,
      );
      this._tracks$.next(this.tracks);
      this._playlist$.next(this.playlist);
    }
  }

  public async rename(newName: string) {
    let existingPlaylist = await this._getByName(newName);

    if (existingPlaylist) {
      this.notifications.push({
        message: `Playlist with name "${newName}" already exists`,
        type: 'error',
      });
    } else {
      let oldName = this.playlist.name;
      this.playlist.name = newName;
      this.playlist.placeholder = 0;
      this._playlist$.next(this.playlist);
      await Playlist.store.update(this.playlist.id, this.playlist);

      this.notifications.push({
        message: `Renamed "${oldName}" to "${newName}"`,
        type: 'success',
      });
    }
  }

  public getAllPlaylists() {
     return Playlist.store.where('persistent').equals(1).toArray();
  }

  private async _getByName(name: string) {
    return await Playlist.store
      .where('name')
      .equalsIgnoreCase(name)
      .first();
  }

  private async _getById(id: number) {
    return await Playlist.store
      .where('id')
      .equals(id)
      .first();
  }

}
