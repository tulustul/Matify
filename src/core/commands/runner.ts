import { Injector, Injectable } from '@angular/core';

import { ICommand } from './command.interface';
import { REGISTRY } from './registry';

@Injectable()
export class CommandRunner {

  constructor(private injector: Injector) {}

  runCommand(command: ICommand, ...args) {
    try {
      this.injector.get(
        command.service.constructor
      )[command.property](...args);
    } catch (e) {
      console.error(
        `Error while executing command "${command.name} ${args}". ` +
        `Reason: ${e}. Stack trace: ${e.stack}`
      );
    }
  }

  runCommandByName(commandName: string, ...args) {
    this.runCommand(REGISTRY.get(commandName), ...args);
  }

}
