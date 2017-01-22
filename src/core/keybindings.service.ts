import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Settings } from './settings.service';
import { getCommandByName, ICommand, CommandRunner } from './commands';

@Injectable()
export class Keybindings {

  bindings: Map<string, {command: ICommand, args: any[]}>;

  keys$ = Observable.fromEvent(
    window, 'keydown'
  ).map((event: KeyboardEvent) => {
    let combo = '';
    if (event.ctrlKey) {
      combo += 'ctrl+';
    }
    if (event.shiftKey) {
      combo += 'shift+';
    }
    if (event.altKey) {
      combo += 'alt+';
    }
    combo += (event.key.trim() || event.code).toLowerCase();
    return combo;
  }).filter(combo => {
    if (document.activeElement.tagName === 'INPUT') {
      return combo.length > 1;
    };
    return true;
  });

  constructor(
    private settings: Settings,
    private commandRunner: CommandRunner,
  ) {
    settings.changes$.subscribe(() => this.initBindings());
    this.keys$.subscribe(combo => this.handleCombo(combo));
  }

  initBindings() {
    this.bindings = new Map();
    for (let binding of this.settings.keybindings) {
      let command = getCommandByName(binding.command);
      if (!command) {
        console.error(`keybindings: unknown command "${binding.command}"`);
      } else {
        for (let key of binding.keys) {
          this.bindings.set(key, {
            command: command,
            args: binding.args || [],
          });
        }
      }
    }
  }

  handleCombo(combo: string) {
    let binding = this.bindings.get(combo);
    if (binding) {
      this.commandRunner.runCommand(binding.command, ...binding.args);
    }
  }

}
