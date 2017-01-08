import { Injectable } from '@angular/core';

import { Command } from 'app/commands';
import { PaletteService } from './palette.service';

@Injectable()
export class Commands {

  constructor(private paletteService: PaletteService) {}

  @Command({
    isVisibleInPallete: false,
  })
  openCommandsPalette() {
    this.paletteService.openPalette();
  }

}
