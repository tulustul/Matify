import { Injectable, Injector } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import { PLUGGINS_DATA } from 'core/plugging';
import { TracksStore, Track } from 'core/tracks';

@Injectable()
export class TracksService {

  stores: TracksStore[];

  constructor(injector: Injector) {
    this.stores = PLUGGINS_DATA.trackStores.map(
      store_class => injector.get(store_class)
    );
  }

  init() {
    this.stores.forEach(store => store.init());
  }

  search(term: string, page: number) {
    return <Observable<Track[]>>Observable.create((observer: Observer<Track[]>) => {
      let remaining = this.stores.length;

      this.stores.forEach(async store => {
        try {
          let tracks = await store.search(term, page);
          observer.next(tracks);
        } catch (e) {
          console.error(
            `Failed to search tracks for provider "${store.name}". Reason: ${e}`
          );
          console.error(e.stack);
        }
        remaining -= 1;
        if (remaining === 0) {
          observer.complete();
        }
      });
    });
  }

  findSimilar(track: Track) {
    return <Observable<Track[]>>Observable.create((observer: Observer<Track[]>) => {
      let remaining = this.stores.length;

      this.stores.forEach(async store => {
        if (!store.findSimilar) {
          return;
        }
        try {
          let tracks = await store.findSimilar(track);
          observer.next(tracks);
        } catch (e) {
          console.error(
            `Failed to find similar tracks for provider "${store.name}". Reason: ${e}`
          );
          console.error(e.stack);
        }
        remaining -= 1;
        if (remaining === 0) {
          observer.complete();
        }
      });
    });
  }

}
