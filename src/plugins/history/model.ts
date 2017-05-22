import { Dexie } from 'dexie';

import { Store, PrimaryKey, Index } from 'core/db';

@Store()
export class History {
  static store: Dexie.Table<History, number>;

  @PrimaryKey() id?: number;
  @Index() trackUri: string;
  @Index() date: Date;
  @Index() playtime: number;
}
