import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { AudioService } from 'core/audio.service';
import { LibraryService } from 'core/library.service';
import { Track } from 'core/tracks';

import { History } from './model';

export interface TrackHistory {
  history: History,
  track: Track,
}

export interface GroupedHistory {
  dateString: string;
  trackHistories: TrackHistory[],
}

@Injectable()
export class HistoryService {

  private _history$ = new ReplaySubject<TrackHistory[]>(1);
  history$ = this._history$.asObservable();
  history: TrackHistory[] = [];

  constructor(
    audio: AudioService,
    private libraryService: LibraryService,
  ) {
    audio.playFinish$.subscribe(trackPlaytime => {
      History.store.add({
        trackUri: trackPlaytime.track.uri,
        date: new Date(),
        playtime: trackPlaytime.playTime,
      });
    });
  }

  async getHistory(to: Date = new Date()) {
    const histories = await History.store
      .where('date').below(to)
      .reverse()
      .limit(100)
      .toArray();

    const tracks = await this.libraryService.getTracksByUris(
      histories.map(t => t.trackUri),
    );

    const urisMap = new Map<string, Track>();
    for (const track of tracks) {
      urisMap.set(track.uri, track);
    }

    this.history = [];

    for (const play of histories) {
      this.history.push({
        history: play,
        track: urisMap.get(play.trackUri),
      });
    };

    this._history$.next(this.history);
  }

}
