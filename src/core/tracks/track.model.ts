import { Dexie } from 'dexie';

import { Store, PrimaryKey, Index } from 'core/db';

@Store()
export class Track {
  static store: Dexie.Table<Track, number>;

  @PrimaryKey() id?: number;
  @Index() uri: string;
  @Index() source: string;

  @Index() title: string;
  @Index() album: string;
  @Index() artist: string;
  @Index() track: string;
  @Index() year: number;
  @Index() genre: string;
  @Index() length: number;

  @Index() rank?: number;
  @Index() plays?: number;

  sourceId = '';

  artworkUri: string;
}

@Store()
export class TrackWord {
  static store: Dexie.Table<TrackWord, number>;

  @Index() trackId: number;
  @Index() word: string;
}
