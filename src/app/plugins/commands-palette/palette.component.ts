import { Component } from '@angular/core';

import {
  getCommands,
  runCommand,
  ICommand,
} from 'app/commands';

@Component({
  selector: 'commands-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent {

  commands = getCommands().filter(
    c => c.isVisibleInPallete
  ).sort((a, b) => a.displayName > b.displayName ? 1 : -1);

  runCommand(command: ICommand) {
    runCommand(command);
  }

}
