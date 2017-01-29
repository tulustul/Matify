import { NgModule } from '@angular/core';

import { MODULES, TRACK_STORES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SpotifyStore } from './spotify.service';

@NgModule({
  imports: [CoreModule],
  providers: [SpotifyStore],
})
export class SpotifyModule { }

MODULES.push(SpotifyModule);
TRACK_STORES.push(SpotifyStore);
