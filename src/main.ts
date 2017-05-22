import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import './plugins/commandsPalette';

// stores
import './plugins/localTracks';
import './plugins/SoundCloud';
import './plugins/Spotify';
import './plugins/Youtube';

// sidebar
import './plugins/search';
import './plugins/discover';
import './plugins/library';
import './plugins/similarTracks';
import './plugins/playlists';
import './plugins/history';
import './plugins/settings';

// bar
import './plugins/playbackControls';
import './plugins/trackIndicator';
import './plugins/trackScheduler';
import './plugins/volumeControl';
import './plugins/barSourceIndicator';

// views
import './plugins/shortcuts';
import './plugins/playlist';

// others
import './plugins/basicVisualizations';
import './plugins/audioErrorsNotifier';
import './plugins/notificationsPlayground';
import './plugins/themes';

import { environment } from './environments/environment';
import { AppModule } from './core/app.module';
import { initDB } from './core/db';

initDB();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
