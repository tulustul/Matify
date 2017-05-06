import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';

@Component({
  selector: 'mp-simple-track-item',
  templateUrl: './simpleTrackItem.component.html',
  styleUrls: ['./simpleTrackItem.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTrackItemComponent {

  @Input()
  track: Track;

  @Output('select')
  select$ = new EventEmitter<Track>();

  @Output('play')
  play$ = new EventEmitter<Track>();

  constructor(
    private audio: AudioService,
    private cdr: ChangeDetectorRef,
  ) {
    this.audio.track$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  @HostBinding('class.mp-row-marked')
  get isActive() {
    return this.audio.track === this.track;
  }

  @HostListener('click')
  select() {
    this.select$.next(this.track);
  }

  play(event: Event) {
    this.play$.next(this.track);
    event.stopPropagation();
  }

}
