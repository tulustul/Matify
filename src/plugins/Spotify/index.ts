import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SpotifyStore } from './spotify.service';

@Plugin({
  trackStores: [
    SpotifyStore,
  ],
})
@NgModule({
  imports: [CoreModule],
  providers: [SpotifyStore],
})
export class Module { }
