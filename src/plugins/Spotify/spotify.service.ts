import { Injectable } from '@angular/core';

import * as SpotifyWebApi from 'spotify-web-api-js';

import { TracksStore, Track } from 'core/tracks';
import { PLUGGINS_DATA } from 'core/plugging';
import { Settings } from 'core/settings.service';

@Injectable()
export class SpotifyStore implements TracksStore {

  name = 'Spotify';

  api = new SpotifyWebApi();

  enabled = false;

  constructor(private settings: Settings) {
  }

  init() {
    let login = this.settings['spotify.login'];
    let password = this.settings['spotify.password'];

    this.enabled = login && password;

    if (this.enabled) {
      PLUGGINS_DATA.proxyServerParams.push(`--spotify-login=${login}`);
      PLUGGINS_DATA.proxyServerParams.push(`--spotify-password=${password}`);
    }
  }

  search(term: string) {
    return new Promise<Track[]>(async (resolve, reject) => {
      if (!this.enabled) {
        resolve([]);
        return;
      }

      let response = await this.api.searchTracks(term);
      let _tracks = response.tracks.items;

      let tracks: Track[] = _tracks.map(t => {
        let port = this.settings['proxyServerPort'];
        return <Track>{
          uri: `http://localhost:${port}/spotify/${t.uri}`,
          title: t.name,
          album: t.album.name,
          artist: t.artists.map(a => a.name).join(', '),
          length: t.duration_ms / 1000,
          artworkUri: t.album.images.length ? t.album.images[0].url : '',
          track: t.track_number.toString(),
          source: 'spotify',
        };
      });

      resolve(tracks);
    });
  }

}
