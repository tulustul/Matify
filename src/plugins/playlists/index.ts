import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MODULES, PAGES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { PlaylistsComponent } from './playlists.component';
import { PlaylistModule } from 'plugins/playlist';

@NgModule({
  imports: [
    CommonModule,
    PlaylistModule,
    CoreModule,
  ],
  declarations: [PlaylistsComponent],
  exports: [PlaylistsComponent],
  entryComponents: [PlaylistsComponent],
})
export class PlaylistsModule { }

MODULES.push(PlaylistsModule);
PAGES.push({
  icon: 'playlist_play',
  name: 'Playlists',
  component: PlaylistsComponent,
});
