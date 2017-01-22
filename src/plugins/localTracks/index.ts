import { NgModule } from '@angular/core';

import { Scan } from './scan';
import { LocalTracksStore } from './localTracks.service';

import { MODULES, TRACK_STORES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

@NgModule({
  imports: [CoreModule],
  providers: [Scan, LocalTracksStore],
})
export class PaletteModule { }

MODULES.push(PaletteModule);
TRACK_STORES.push(LocalTracksStore);
