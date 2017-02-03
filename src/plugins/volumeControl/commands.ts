import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { AudioService } from 'core/audio.service';

@Injectable()
export class Commands {

  constructor(private audio: AudioService) {}

  @Command({isVisibleInPallete: false})
  volumeBy(offset: number) {
    this.audio.volume += offset;
  }

}
