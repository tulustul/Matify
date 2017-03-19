import { NgModule } from '@angular/core';

import { Scan } from './scan';
import { LocalTracksStore } from './localTracks.service';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

@Plugin({
  trackStores: [LocalTracksStore],
})
@NgModule({
  imports: [CoreModule],
  providers: [Scan, LocalTracksStore],
})
export class Module { }
