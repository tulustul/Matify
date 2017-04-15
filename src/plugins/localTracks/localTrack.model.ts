import { Dexie } from 'dexie';

import { Store, PrimaryKey, Index } from 'core/db';
import { Track } from 'core/tracks';

@Store()
export class LocalTrack implements Track {
  static store: Dexie.Table<LocalTrack, number>;

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
  sourceId = '';

  artworkUri: string;
}

@Store()
export class LocalTrackWord {
  static store: Dexie.Table<LocalTrackWord, number>;

  @Index() localTrackId: number;
  @Index() word: string;
}
