import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { AudioService } from 'core/audio.service';

@Injectable()
export class Commands {

  constructor(private audio: AudioService) {}

  @Command({isVisibleInPallete: false})
  stop() {
    this.audio.stop();
  }

  @Command({isVisibleInPallete: false})
  togglePause() {
    this.audio.togglePause();
  }

}
