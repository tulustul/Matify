import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { Module as SimplePlaylistModule } from 'plugins/simplePlaylist';

import { SimilarTracksComponent } from './similarTracks.component';

@Plugin({
  menuItems: [{
    icon: 'done',
    name: 'Similar',
    component: SimilarTracksComponent,
  }],
})
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SimplePlaylistModule,
  ],
  declarations: [
    SimilarTracksComponent
  ],
  entryComponents: [
    SimilarTracksComponent
  ],
})
export class Module { }
