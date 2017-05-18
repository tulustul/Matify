import {
  TracksStore,
  Track,
  TrackContainer,
  extendMetadata,
} from 'core/tracks';

export class SoundCloudStore implements TracksStore {

  PAGE_SIZE = 30;

  name = 'SoundCloud';

  CLIENT_ID = '2add0f709fcfae1fd7a198ec7573d2d4';

  CLIENT_SECRET = 'httpd1cd7829da2e98e1e0621d85d57a2077';

  SC = (window as any).SC;

  constructor() {
    this.SC.initialize({
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
    });
  }

  init() {}

  search(term: string, page: number) {
    return this._search('/tracks', {
        q: term,
        offset: this.PAGE_SIZE * page,
        limit: this.PAGE_SIZE,
    });
  }

  async findSimilar(track: Track) {
    let sourceId;
    if (track.source === 'soundcloud') {
      sourceId = track.sourceId;
    } else {
      const searchTerm = `${track.artist} ${track.album} ${track.title}`;
      const tracks = await this._search('/tracks', {q: searchTerm});
      if (tracks.length) {
        sourceId = tracks[0].sourceId;
      }
    }
    if (sourceId) {
      return this._search(`/tracks/${sourceId}/related`, {
          limit: this.PAGE_SIZE,
      });
    } else {
      return Promise.resolve([]);
    }
  }

  async searchAlbums(term: string, page = 0) {
    return new Promise<TrackContainer[]>(async (resolve, reject) => {
      const playlists = await this.SC.get('/playlists', {q: term});
      // const playlists = await this.searchPlaylists(term);
      const tracks = await Promise.all(
        playlists.map(p => this.searchPlaylistTracks(p))
      );
      resolve(Array.prototype.concat.apply([], tracks));
    });
  }

  private searchPlaylistTracks(playlist) {
    return new Promise<TrackContainer>(async (resolve, reject) => {
      const tracks = await this._search(
        `playlists/${playlist.id}/tracks`, {}, true,
      );
      resolve(<TrackContainer>{
        name: playlist.title,
        artworkUri: playlist.artwork_url,
        tracks: tracks,
        expanded: false,
      });
    });
  }

  private _search(url: string, params: any, isChild = false) {
    return new Promise<Track[]>(async (resolve, reject) => {
      let _tracks = await this.SC.get(url, params);

      let tracks: Track[] = _tracks.map(t => {
        return extendMetadata(<Track>{
          uri: `${t.stream_url}?client_id=${this.CLIENT_ID}`,
          title: t.title,
          album: '',
          artist: '',
          length: t.duration / 1000,
          artworkUri: t.artwork_url || '',
          genre: t.genre,
          year: t.release_year,
          source: 'soundcloud',
          sourceId: t.id,
        });
      });

      resolve(tracks);
    });
  }

}
