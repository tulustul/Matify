import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { PlaylistsComponent } from './playlists.component';
import { Module as PlaylistModule } from 'plugins/playlist';

@Plugin({
  menuItems: [{
    icon: 'playlist_play',
    name: 'Playlists',
    component: PlaylistsComponent,
  }],
})
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
export class Module { }
