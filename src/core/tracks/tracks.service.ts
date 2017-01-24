import { Injectable, Injector } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import { TRACK_STORES } from 'core/plugging';
import { TracksStore, Track } from 'core/tracks';

@Injectable()
export class TracksService {

  stores: TracksStore[];

  constructor(injector: Injector) {
    this.stores = TRACK_STORES.map(store_class => injector.get(store_class));
  }

  search(term: string) {
    return <Observable<Track[]>>Observable.create((observer: Observer<Track[]>) => {
      let remaining = this.stores.length;

      this.stores.forEach(async store => {
        try {
          let tracks = await store.search(term);
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

}
