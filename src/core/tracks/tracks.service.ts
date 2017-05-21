import { Injectable, Injector } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import { PLUGGINS_DATA } from 'core/plugging';
import { Settings } from 'core/settings.service';
import { TracksStore, Track, TrackContainer } from 'core/tracks';

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
    return this.queryStore<Track>(
      'search', store => store.search(term, page),
    );
  }

  searchAlbums(term: string, page: number) {
    return this.queryStore<TrackContainer>(
      'searchAlbums', store => store.searchAlbums(term, page),
    );
  }

  findSimilar(track: Track) {
    return this.queryStore<Track>(
      'findSimilar', store => store.findSimilar(track),
    );
  }

  private queryStore<T>(
    methodName: string,
    queryCall: (store: TracksStore) => Promise<T[]>,
  ) {
     return <Observable<T[]>>Observable.create((observer: Observer<T[]>) => {
      let remaining = this.enabledStores.length;

      let tracks: T[] = [];

      this.enabledStores.forEach(async store => {
        if (!store[methodName]) {
          return;
        }
        try {
          const newTracks = await queryCall(store);
          tracks = tracks.concat(newTracks);
          observer.next(tracks);
        } catch (e) {
          console.error(
            `Failed to run "${methodName}" for provider "${store.name}".`
          );
          console.error(e.stack);
        }
        remaining -= 1;
        if (remaining === 0) {
          observer.complete();
        }
      });
    }).share();
  }

}
