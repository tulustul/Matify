import { Track, TrackContainer } from './track.interface';

export interface TracksStore {

  name: string;

  search(term: string, page: number): Promise<Track[]>;

  searchAlbums?(term: string, page: number): Promise<TrackContainer[]>;

  findSimilar?(track: Track): Promise<Track[]>;

  init();

}
