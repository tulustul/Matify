import { Injectable, Injector } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import { PLUGGINS_DATA } from 'core/plugging';
import { Settings } from 'core/settings.service';
import { TracksStore, Track } from 'core/tracks';

@Injectable()
export class TracksService {

  allStores: TracksStore[];

  enabledStores: TracksStore[];

  constructor(
    private settings: Settings,
    injector: Injector,
  ) {
    this.allStores = PLUGGINS_DATA.trackStores.map(
      store_class => injector.get(store_class)
    );

    this.checkEnabledStores();

    settings.changes$.subscribe(() => this.checkEnabledStores());
  }

  checkEnabledStores() {
    this.enabledStores = this.allStores.filter(store => {
      const storeKey = store.name.toLowerCase();
      return this.settings[`search.${storeKey}`];
    });
  }

  init() {
    this.allStores.forEach(store => store.init());
  }

  search(term: string, page: number) {
    return <Observable<Track[]>>Observable.create((observer: Observer<Track[]>) => {
      let remaining = this.enabledStores.length;

      this.enabledStores.forEach(async store => {
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
      let remaining = this.enabledStores.length;

      this.enabledStores.forEach(async store => {
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
