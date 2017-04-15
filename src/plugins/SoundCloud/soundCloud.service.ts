import { TracksStore, Track, extendMetadata } from 'core/tracks';

// import * as SC from 'soundcloud';

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
    return new Promise<Track[]>(async (resolve, reject) => {
      let _tracks = await this.SC.get('/tracks', {
        q: term,
        offset: this.PAGE_SIZE * page,
        limit: this.PAGE_SIZE,
      });

      let tracks: Track[] = _tracks.map(t => {
        return extendMetadata(<Track>{
          uri: `${t.stream_url}?client_id=${this.CLIENT_ID}`,
          title: t.title,
          album: '',
          artist: '',
          length: t.duration / 1000,
          videoUri: t.video_url,
          artworkUri: t.artwork_url || '',
          genre: t.genre,
          year: t.release_year,
          source: 'soundcloud',
        });
      });

      resolve(tracks);
    });
  }

}
