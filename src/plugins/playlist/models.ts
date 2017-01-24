import { Dexie } from 'dexie';

import { Store, PrimaryKey, Index } from 'core/db';
import { Track } from 'core/tracks';

@Store()
export class Playlist {
  static store: Dexie.Table<Playlist, number>;

  @PrimaryKey() id?: number;
  @Index() name: string;
  @Index() placeholder?: string;
}

@Store()
export class PlaylistTracks {
  static store: Dexie.Table<PlaylistTracks, number>;

  @PrimaryKey() playlistId: number;
  tracks: Track[];
}
