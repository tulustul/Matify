import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { Settings } from 'core/settings.service';

import { PlaylistCommands } from 'plugins/playlist';

type Order = 'random' | 'oneByOne';

@Injectable()
export class TrackSchedulerService {

  order: Order = 'oneByOne';
  private _order$ = new ReplaySubject<Order>();
  order$ = this._order$.asObservable();

  ORDER_SETTING = 'trackScheduler.order';

  constructor(
    private audio: AudioService,
    private playlistCommands: PlaylistCommands,
    private settings: Settings,
  ) {
    settings.changes$.subscribe(() => {
      this.order = settings[this.ORDER_SETTING] || 'oneByOne';
      this._order$.next(this.order);
    });

    this.audio.trackend$.subscribe(() => {
      if (this.order === 'oneByOne') {
        this.playlistCommands.skipTrackBy(1);
      } else if (this.order === 'random') {
        this.playlistCommands.randomTrack();
      }
    });
  }

  setOrder(order: Order) {
    this.order = order;
    this._order$.next(this.order);
    this.settings.userSettings[this.ORDER_SETTING] = this.order;
    this.settings.saveUserSettings();
  }

}
