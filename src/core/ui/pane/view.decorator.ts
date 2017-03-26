import { VIEWS_REGISTRY } from './registry';

export function View(constructor: Function) {
  const name = constructor.name;
  if (VIEWS_REGISTRY.has(name)) {
    console.error(`View "${name}" is already registered.`);
  } else {
    VIEWS_REGISTRY.set(name, constructor);
  }
}
