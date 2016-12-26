import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { createConnection } from 'typeorm';

import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

import './plugins/commands-palette';
import './plugins/scan';
import './plugins/playlist';

createConnection().then(connection => {
  // here you can start to work with your entities
}).catch(error => console.log(error));

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
