import { Injectable } from '@angular/core';

import { Command } from 'app/commands';
import { AudioService } from 'app/audio.service';

@Injectable()
export class Commands {

  constructor(private audio: AudioService) {}

  @Command({isVisibleInPallete: false})
  seekBy(offset: number) {
    this.audio.seekBy(offset);
  }

  @Command({isVisibleInPallete: false})
  stop() {
    this.audio.stop();
  }

  @Command({isVisibleInPallete: false})
  togglePause() {
    this.audio.togglePause();
  }

  @Command({isVisibleInPallete: false})
  volumeBy(offset: number) {
    this.audio.volume += offset;
  }

}
