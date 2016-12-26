import { ICommand } from './command.interface';

export const REGISTRY = new Map<string, ICommand>();

export function register(commandDefiniton: ICommand) {
  let key = commandDefiniton.name;
  if (REGISTRY.has(key)) {
    console.error(`Command "${key} is already registered`);
  } else {
    REGISTRY.set(key, commandDefiniton);
  }
}

export function getCommands() {
  return Array.from(REGISTRY.values());
}
