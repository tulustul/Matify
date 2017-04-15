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

    return new Promise<Track[]>(async (resolve, reject) => {

      const requestData = {
        q: term,
        part: 'snippet',
        type: 'video',
      };

      if (this.nextPageToken) {
        requestData['pageToken'] = this.nextPageToken;
      }

      const request = this.gapi.client.youtube.search.list(requestData);

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
          });
        });
        resolve(tracks);
      });
    });
  }

}
