import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { YoutubeStore } from './youtube.service';

@Plugin({
  trackStores: [YoutubeStore],
})
@NgModule({
  imports: [CoreModule],
  providers: [YoutubeStore],
})
export class Module { }
