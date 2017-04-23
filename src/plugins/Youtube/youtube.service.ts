import { TracksStore, Track, TrackContainer, extendMetadata } from 'core/tracks';

import { Observable } from 'rxjs';

export class YoutubeStore implements TracksStore {

  name = 'Youtube';

  ready = false;

  gapi: any;

  nextPageToken: string;

  constructor() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js?onload=initYoutube';
    document.body.appendChild(script);

    (window as any).initYoutube = () => {
      this.gapi = (window as any).gapi;
      this.gapi.client.setApiKey('AIzaSyAuXJp1dSpee6qjCG10_hOkzbh41sfOxf8');
      this.gapi.client.load('youtube', 'v3', () => {
        this.ready = true;
      });
    };
  }

  init() {}

  search(term: string, page: number) {
    if (page === 0) {
      this.nextPageToken = null;
    }
    return this.searchVideos({q: term});
  }

  async findSimilar(track: Track) {
    let sourceId;
    if (track.source === 'youtube') {
      sourceId = track.sourceId;
    } else {
      const searchTerm = `${track.artist} ${track.album} ${track.title}`;
      const tracks = await this.searchVideos({q: searchTerm});
      if (tracks.length) {
        sourceId = tracks[0].sourceId;
      }
    }
    return this.searchVideos({relatedToVideoId: sourceId});
  }

  async searchAlbums(term: string, page: 0) {
    return new Promise<TrackContainer[]>(async (resolve, reject) => {
      if (page === 0) {
        this.nextPageToken = null;
      }
      const playlists = await this.searchPlaylists(term);
      const tracks = await Promise.all(
        playlists.map(p => this.searchPlaylistTracks(p))
      );
      resolve(Array.prototype.concat.apply([], tracks));
    });
  }

  private searchPlaylistTracks(p: any) {
    const request = this.gapi.client.youtube.playlistItems.list({
        part: 'snippet',
        playlistId: p.id.playlistId,
        maxResults: 50,
    });

    return new Promise<TrackContainer>((resolve, reject) => {
      request.execute(response => {
        response.items = response.items || [];
        const tracks: Track[] = response.items.map(t => {
          return extendMetadata(<Track>{
            uri: `http://localhost:5000/youtube/${t.snippet.resourceId.videoId}`,
            title: t.snippet.title,
            album: p.snippet.title,
            artist: '',
            length: null,
            artworkUri: t.snippet.thumbnails ? t.snippet.thumbnails.default.url : '',
            track: null,
            source: 'youtube',
            sourceId: t.snippet.resourceId.videoId,
          });
        });
        resolve({
          name: p.snippet.title,
          artworkUri: p.snippet.thumbnails.default.url,
          tracks,
          expanded: false,
        });
      });
    });
  }

  private searchVideos(params) {
    params.type = 'video';
    params.videoCategoryId = 10;  // music
    return this._search(params);
  }

  private searchPlaylists(term: string) {
     return new Promise<any[]>(async (resolve, reject) => {
      const params: any = {
        q: term,
        part: 'snippet',
        type: 'playlist',
      };

      if (this.nextPageToken) {
        params.pageToken = this.nextPageToken;
      }

      const request = this.gapi.client.youtube.search.list(params);

      request.execute(response => {
        this.nextPageToken = response.nextPageToken;
        response.items = response.items || [];
        const playlists = response.items.map(t => {
          return t;
        });
        resolve(playlists);
      });
    });
  }

  private _search(params: any) {
    return new Promise<Track[]>(async (resolve, reject) => {
      params.part = 'snippet';

      if (this.nextPageToken) {
        params.pageToken = this.nextPageToken;
      }

      const request = this.gapi.client.youtube.search.list(params);

      request.execute(response => {
        this.nextPageToken = response.nextPageToken;
        response.items = response.items || [];
        const tracks: Track[] = response.items.map(t => {
          return extendMetadata(<Track>{
            uri: `http://localhost:5000/youtube/${t.id.videoId}`,
            title: t.snippet.title,
            album: '',
            artist: '',
            length: null,
            artworkUri: t.snippet.thumbnails.default.url,
            track: null,
            source: 'youtube',
            sourceId: t.id.videoId,
          });
        });
        resolve(tracks);
      });
    });
  }

}
