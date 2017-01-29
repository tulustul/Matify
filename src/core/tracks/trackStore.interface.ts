import { Track } from './track.interface';

export interface TracksStore {

  name: string;

  search(term: string): Promise<Track[]>;

  init();

}
