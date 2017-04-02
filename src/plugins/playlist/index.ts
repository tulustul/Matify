export * from './models';
export * from './playlist.service';
export * from './playlists.service';
export * from './playlist/playlist.component';
export * from './commands';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreModule } from 'core/core.module';
import { Plugin } from 'core/plugging';

import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistService } from './playlist.service';
import { PlaylistsService } from './playlists.service';
import { PlaylistCommands } from './commands';

@Plugin()
@NgModule({
  declarations: [
    PlaylistComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
  ],
  entryComponents: [
    PlaylistComponent,
  ],
  exports: [PlaylistComponent],
  providers: [PlaylistService, PlaylistsService, PlaylistCommands],
})
export class Module { }
