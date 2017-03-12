import { Injectable } from '@angular/core';

import { Command, getCommands, CommandRunner } from 'core/commands';
import { PaletteService } from 'core/palette';

@Injectable()
export class Commands {

  constructor(
    private paletteService: PaletteService,
    private commandRunner: CommandRunner,
  ) {}

  @Command({isVisibleInPallete: false})
  openCommandsPalette() {
    let commands = getCommands().filter(
      c => c.isVisibleInPallete
    ).sort((a, b) => a.displayName > b.displayName ? 1 : -1);

    this.paletteService.openPalette(
      commands,
      ['displayName', 'keybindings'],
      command => this.commandRunner.runCommand(command),
    )
  }

}
