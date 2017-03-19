import { Component, HostBinding } from '@angular/core';

import { AudioService } from 'core/audio.service';
import { Track } from 'core/tracks';

@Component({
  selector: 'mp-source-indicator',
  templateUrl: './sourceIndicator.component.html',
  styleUrls: ['./sourceIndicator.component.scss'],
})
export class SourceIndicatorComponent {

  @HostBinding('class') cssClass = 'mp-primary';

  track: Track;

  ICONS_MAP = {
    youtube: 'youtube-play',
    spotify: 'spotify',
    soundcloud: 'soundcloud',
    disk: 'hdd-o',
  };

  constructor(private audio: AudioService) {
    this.audio.track$.subscribe(track => this.track = track);
  }

  get icon() {
    return this.track ? this.ICONS_MAP[this.track.source] || 'hdd-o' : 'hdd-o';
  }

}
