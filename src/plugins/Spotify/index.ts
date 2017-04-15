import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SpotifyStore } from './spotify.service';

@Plugin({
  trackStores: [
    SpotifyStore,
  ],
  settings: [
    {
      key: 'spotify.login',
      displayName: 'Spotify login',
      component: 'input',
    },
    {
      key: 'spotify.password',
      displayName: 'Spotify password',
      component: 'password',
    },
  ]
})
@NgModule({
  imports: [CoreModule],
  providers: [SpotifyStore],
})
export class Module { }
