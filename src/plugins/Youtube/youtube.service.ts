import { TracksStore, Track, extendMetadata } from 'core/tracks';

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
    return this._search({q: term});
  }

  async findSimilar(track: Track) {
    let sourceId;
    if (track.source === 'youtube') {
      sourceId = track.sourceId;
    } else {
      const searchTerm = `${track.artist} ${track.album} ${track.title}`;
      const tracks = await this._search({q: searchTerm});
      if (tracks.length) {
        sourceId = tracks[0].sourceId;
      }
    }
    return this._search({relatedToVideoId: sourceId});
  }

  private _search(params: any) {
    return new Promise<Track[]>(async (resolve, reject) => {
      params.part = 'snippet';
      params.type = 'video';

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
