import { Dexie } from 'dexie';

import { Store, PrimaryKey, Index } from 'app/db';

@Store()
export class Playlist {
  objects: Dexie.Table<Playlist, number>;

  @PrimaryKey() id: number;
  @Index() name: string;
}
