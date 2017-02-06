import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import './plugins/commandsPalette';
import './plugins/localTracks';
import './plugins/SoundCloud';
import './plugins/Spotify';
import './plugins/Youtube';
import './plugins/search';
import './plugins/playlist';
import './plugins/library';
import './plugins/trackScheduler';
import './plugins/themes';
import './plugins/playlists';
import './plugins/playbackControls';
import './plugins/trackIndicator';
import './plugins/volumeControl';
import './plugins/barSourceIndicator';
import './plugins/equalizerVisualization';

import { environment } from './environments/environment';
import { AppModule } from './core/app.module';
import { initDB } from './core/db';

initDB();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
