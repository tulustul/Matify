import { TracksStore, Track } from 'core/tracks';

export class YoutubeStore implements TracksStore {

  name = 'Youtube';

  ready = false;

  gapi: any;

  constructor() {
    let script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js?onload=initYoutube'
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

  search(term: string) {
    return new Promise<Track[]>(async (resolve, reject) => {

      var request = this.gapi.client.youtube.search.list({
        q: term,
        part: 'snippet',
      });

      request.execute(response => {
        let tracks: Track[] = response.items.map(t => {
          return <Track>{
            uri: `http://localhost:5000/youtube/${t.id.videoId}`,
            title: t.snippet.title,
            album: '',
            artist: '',
            length: null,
            artworkUri: t.snippet.thumbnails.default.url,
            track: null,
          };
        });
        resolve(tracks);
      });
    });
  }

}
