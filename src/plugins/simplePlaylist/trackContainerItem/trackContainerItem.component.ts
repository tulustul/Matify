import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Track, TrackContainer } from 'core/tracks';
import { AudioService } from 'core/audio.service';

@Component({
  selector: 'mp-track-container-item',
  templateUrl: './trackContainerItem.component.html',
  styleUrls: ['./trackContainerItem.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackContainerItemComponent {

  @Input()
  trackContainer: TrackContainer;

  @Output('play')
  play$ = new EventEmitter<Track>();

  @Output('select')
  select$ = new EventEmitter<Track>();

  @Output('selectAll')
  selectAll$ = new EventEmitter<TrackContainer>();

  expanded = false;

  play(track: Track) {
    this.play$.next(track);
  }

  select(track: Track) {
    this.select$.next(track);
  }

  selectAll(event: Event) {
    this.selectAll$.next(this.trackContainer);
    event.stopPropagation();
  }

}
