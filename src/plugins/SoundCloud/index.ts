import { NgModule } from '@angular/core';

import { MODULES, TRACK_STORES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SoundCloudStore } from './soundCloud.service';

@NgModule({
  imports: [CoreModule],
  providers: [SoundCloudStore],
})
export class SoundCloudModule { }

MODULES.push(SoundCloudModule);
TRACK_STORES.push(SoundCloudStore);
