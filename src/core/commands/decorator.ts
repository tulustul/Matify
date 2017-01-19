import { register } from './registry';
import { ICommand } from './command.interface';

export function Command(commandDef: ICommand={}) {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    commandDef.service = target;
    commandDef.property = propertyKey;

    if (!commandDef.name) {
      commandDef.name = propertyKey;
    }

    if (!commandDef.displayName) {
      commandDef.displayName = commandDef.name;
    }

    if (commandDef.isVisibleInPallete === undefined) {
      commandDef.isVisibleInPallete = true;
    }

    console.debug(`Registering command "${commandDef.name}"`);

    register(commandDef);
  }
}
