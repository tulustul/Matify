import { Injectable } from '@angular/core';

import * as jss from 'jss/jss';

import { ReplaySubject, Observable } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';
import { formatSeconds } from 'core/utils';
import { NotificationsService } from 'core/ui/notifications';

import { Playlist, PlaylistTracks } from './models';
import { PlaylistWithTracks } from './playlists.service';

interface Column {
  displayName: string;
  size: string;
  getter: (track: Track) => any;
}

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

  // private _playlists = new Map<number, ReplaySubject<PlaylistWithTracks>>();

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

  constructor(
    private audio: AudioService,
    private notifications: NotificationsService,
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

  addTrack(track: Track) {
    this.addTracks([track]);
  }

  addTracks(tracks: Track[]) {
    this._updateTracks(this.tracks.concat(tracks));
  }

  clear() {
    this._updateTracks([]);
  }

  // async setPlaylist(playlist: PlaylistWithTracks) {
  //   this.playlist = playlist;
  //   this._playlist$.next(this.playlist);
  //   // this.tra
  //   // let playlistTracks = await PlaylistTracks.store.get(playlist.playlistModel.id);
  //   // if (playlistTracks) {
  //     this.tracks = playlist.tracks;
  //     this._tracks$.next(this.tracks);
  //   // }
  // }

  private _updateTracks(tracks: Track[]) {
    this.tracks = tracks;
    this._tracks$.next(this.tracks.slice());
    this._save();
  }

  private _save() {
    if (this.playlist.placeholder === '1') {
      this.playlist.placeholder = '';
      Playlist.store.update(this.playlist.id, this.playlist);
    }
    PlaylistTracks.store.update(this.playlist.id, {
      tracks: this.tracks,
    });
  }

  deleteTrack(track: Track) {
    let index = this.tracks.indexOf(track);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      this._updateTracks(this.tracks);
    }
  }

  focusSearch() {
    this._searchFocus$.next(null);
  }

  public async create() {
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

  public async delete() {
    await PlaylistTracks.store.delete(this.playlist.id);
    await Playlist.store.delete(this.playlist.id);

    this.notifications.push({
      message: `Playlist ${this.playlist.name} has been removed`,
    });

    this.create();
  }

  public async open(playlistName: string) {
    this.playlist = await this._getByName(playlistName);
    if (this.playlist) {
      this.playlistTracks = await PlaylistTracks.store.get(this.playlist.id);
      this.tracks = this.playlistTracks.tracks;
      this._tracks$.next(this.tracks);
      this._playlist$.next(this.playlist);
      // const playlistWithTracks: PlaylistWithTracks = {
      //   name: playlist.name,
      //   tracks: playlistTracks.tracks,
      //   playlistModel: playlist,
      //   tracksModel: playlistTracks,
      // };
      // let playlist$ = this._playlists.get(playlist.id);
      // if (!playlist$) {
      //   playlist$ = new ReplaySubject(1);
      //   this._playlists.set(playlist.id, playlist$);
      // }
      // playlist$.next(playlistWithTracks);
      // return playlistWithTracks;
      // return playlist$;
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
      this.playlist.placeholder = '';
      await Playlist.store.update(this.playlist.id, this.playlist);

      this.notifications.push({
        message: `Renamed "${oldName}" to "${newName}"`,
        type: 'success',
      });
    }
  }

  public getAllPlaylists() {
     return Playlist.store.toArray();
  }

  private async _getByName(name: string) {
    return await Playlist.store
      .where('name')
      .equalsIgnoreCase(name)
      .first();
  }

}
