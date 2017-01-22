import { TracksStore, Track } from 'core/tracks';

export class SoundCloudStore implements TracksStore {

  name = 'SoundCloud';

  search(term: string) {
    return new Promise<Track[]>((resolve, reject) => {
      resolve([]);
    });
  }

}