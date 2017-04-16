import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { Module as PlaylistModule } from 'plugins/playlist';

import { SimplePlaylistComponent } from './simplePlaylist.component';

@Plugin()
@NgModule({
  imports: [
    CommonModule,
    PlaylistModule,
    CoreModule,
  ],
  declarations: [
    SimplePlaylistComponent,
  ],
  exports: [
    SimplePlaylistComponent,
  ],
})
export class Module { }
