export * from './models';
export * from './playlist.service';
export * from './playlists.service';
export * from './playlist.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreModule } from 'core/core.module';
import { MODULES } from 'core/plugging';

import { PlaylistComponent } from './playlist.component';
import { PlaylistService } from './playlist.service';
import { PlaylistsService } from './playlists.service';
import { Commands } from './commands';

@NgModule({
  declarations: [
    PlaylistComponent,
  ],
  imports: [CommonModule, CoreModule, FormsModule],
  exports: [PlaylistComponent],
  providers: [PlaylistService, PlaylistsService, Commands],
})
export class PlaylistModule { }


MODULES.push(PlaylistModule);
