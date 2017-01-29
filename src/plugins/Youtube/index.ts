import { NgModule } from '@angular/core';

import { MODULES, TRACK_STORES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { YoutubeStore } from './youtube.service';

@NgModule({
  imports: [CoreModule],
  providers: [YoutubeStore],
})
export class YoutubeModule { }

MODULES.push(YoutubeModule);
TRACK_STORES.push(YoutubeStore);
