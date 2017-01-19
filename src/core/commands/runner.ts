import { Injector, Injectable } from '@angular/core';

import { ICommand } from './command.interface';

@Injectable()
export class CommandRunner {

  constructor(private injector: Injector) {}

  runCommand(command: ICommand, ...args) {
    console.debug(`Invoking command "${command.name} ${args}"`);

    try {
      this.injector.get(
        command.service.constructor
      )[command.property](...args);
    } catch (e) {
      console.error(
        `Error while executing command "${command.name} ${args}". ` +
        `Reason: ${e}`
      )
    }
  }

}
