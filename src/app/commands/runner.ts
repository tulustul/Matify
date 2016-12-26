import { ICommand } from './command.interface';

export function runCommand(command: ICommand, ...args) {
  console.debug(`Invoking command "${command.name} ${args}"`);

  try {
    command.func(...args);
  } catch (e) {
    console.error(
      `Error while executing command "${command.name} ${args}". ` +
      `Reason: ${e}`
    )
  }
}
