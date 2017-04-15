import { Track } from './track.interface';

export interface TracksStore {

  name: string;

  search(term: string, page: number): Promise<Track[]>;

  findSimilar?(track: Track): Promise<Track[]>;

  init();

}
