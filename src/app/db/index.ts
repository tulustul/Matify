import { Dexie } from 'dexie';

export * from './decorators';

import { STORES_REGISTRY, FIELDS_REGISTRY } from './registry';

const db = new Dexie('music');

export function deleteDB() {
  db.delete();
}

export function initDB() {
  db.version(2).stores(buildSchema());
  STORES_REGISTRY.forEach((clazz: Function, storeName: string) => {
    clazz['store'] = db[storeName];
  });
}

function buildSchema() {
  let stores = {};
  STORES_REGISTRY.forEach((clazz, storeName) => {
    stores[storeName] = buildFields(storeName);
  });
  console.log(stores);
  return stores;
}

function buildFields(storeName: string) {
  return FIELDS_REGISTRY.get(storeName).join(',');
}
