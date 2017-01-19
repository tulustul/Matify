export const STORES_REGISTRY = new Map<string, Function>();

export const FIELDS_REGISTRY = new Map<string, string[]>();

export function registerStore(storeName: string, clazz: Function) {
  if (STORES_REGISTRY.has(storeName)) {
    console.error(`Store "${storeName}" is already registered`);
    return;
  }
  STORES_REGISTRY.set(storeName, clazz);
}

export function registerIndex(storeName: string, index: string) {
  let list = FIELDS_REGISTRY.get(storeName);
  if (!list) {
    list = [];
    FIELDS_REGISTRY.set(storeName, list);
  }
  list.push(index);
}