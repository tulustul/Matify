import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { HistoryService, TrackHistory } from './history.service';

@Component({
  selector: 'mp-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.historyService.history$.subscribe(history => {
      this.cdr.markForCheck();
    });

    this.historyService.getHistory();
  }

  *getItems() {
    let currentYear = null;
    let currentMonth = null;
    let currentDay = null;

    for (const trackHistory of this.historyService.history) {
      const year = trackHistory.history.date.getFullYear();
      const month = trackHistory.history.date.toLocaleString(
        'en-us', {month: 'long'},
      );
      const day = trackHistory.history.date.toLocaleString(
        'en-us', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      )

      if (year !== currentYear) {
        currentYear = year;
        yield {type: 'year', year};
      }

      if (month !== currentMonth) {
        currentMonth = month;
        yield {type: 'month', month};
      }

      if (day !== currentDay) {
        currentDay = day;
        yield {type: 'day', day};
      }

      yield {type: 'track', trackHistory};
    }
  }

  formatTrackDate(date: Date) {
    return date.toLocaleString('en-us', {
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  formatPlaytime(trackHistory: TrackHistory) {
    return Math.round(Math.min(
      100,
      100 * (trackHistory.history.playtime / trackHistory.track.length)
    )) + '%';
  }

}
