import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { Track, TracksService } from 'core/tracks';

@Injectable()
export class DiscoverService {

  _tracks$ = new ReplaySubject<Track[]>(1);
  tracks$ = this._tracks$.asObservable();
  tracks: Track[] = [];

  constructor(private tracksService: TracksService) {
    this._tracks$.next(this.tracks);
  }

  async discover() {
    const trackFeed = await this.pickTrackFeed();
    this.tracksService.findSimilar(trackFeed).subscribe(tracks => {
      this.tracks = tracks;
      this._tracks$.next(this.tracks);
    });
  }

  async pickTrackFeed() {
    const trackFeeds = await Track.store
      .orderBy('rank')
      .reverse()
      .limit(1000)
      .filter(track => track.rank > 0)
      .toArray();

    const rouletteSum = trackFeeds.reduce<number>(
      (sum, track) => sum + track.rank,
    0);

    const rouletteRoll = Math.round(Math.random() * rouletteSum);

    let roulettePosition = 0;

    for (const track of trackFeeds) {
      roulettePosition += track.rank;
      if (roulettePosition > rouletteRoll) {
        return track;
      }
    }

    return null;
  }

}
