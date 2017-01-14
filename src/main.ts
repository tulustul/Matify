import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import './app/plugins/commands-palette';
import './app/plugins/scan';
import './app/plugins/playlist';
import './app/plugins/notifications';
import './app/plugins/bar';
import './app/plugins/trackScheduler';

import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { initDB } from './app/db';

initDB();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
