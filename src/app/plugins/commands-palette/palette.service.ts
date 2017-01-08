import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import {
  getCommands,
  ICommand,
} from 'app/commands';
import { CommandRunner } from 'app/commands/runner';

@Injectable()
export class PaletteService {

  private _state$ = new ReplaySubject<boolean>(1);
  state$ = this._state$.asObservable();

  commands = getCommands().filter(
    c => c.isVisibleInPallete
  ).sort((a, b) => a.displayName > b.displayName ? 1 : -1);

  constructor(private commandRunner: CommandRunner) {}

  runCommand(command: ICommand) {
    this.closePalette();
    this.commandRunner.runCommand(command);
  }

  opened = false;

  openPalette() {
    this._state$.next(true);
  }

  closePalette() {
    this._state$.next(false);
  }

}
