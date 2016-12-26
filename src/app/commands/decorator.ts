import { register } from './registry';
import { ICommand } from './command.interface';

export function Command(commandDef: ICommand) {
  return (target: Function) => {
    commandDef.func = target;

    if (!commandDef.name) {
      commandDef.name = target.name;
    }

    if (!commandDef.displayName) {
      commandDef.displayName = commandDef.name;
    }

    if (commandDef.isVisibleInPallete === undefined) {
      commandDef.isVisibleInPallete = true;
    }

    console.debug(`Registering command "${commandDef.name}"`);

    register(commandDef);
    return target;
  }
}
