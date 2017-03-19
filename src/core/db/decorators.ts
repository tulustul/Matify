import { registerStore, registerIndex } from './registry';

export function Store() {
  return function(constructor: Function) {
    registerStore(constructor.name, constructor);
  };
}

export function PrimaryKey() {
  return function(clazz: Object, propertyKey: string) {
    registerIndex(clazz.constructor.name, '++' + propertyKey);
  };
}

export function Index() {
  return function(clazz: Object, propertyKey: string) {
    registerIndex(clazz.constructor.name, propertyKey);
  };
}
