import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import './plugins/commandsPalette';
import './plugins/localTracks';
import './plugins/SoundCloud';
import './plugins/playlist';
import './plugins/bar';
import './plugins/trackScheduler';
import './plugins/themes';
import './plugins/library';
import './plugins/search';

import { environment } from './environments/environment';
import { AppModule } from './core/app.module';
import { initDB } from './core/db';

initDB();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
