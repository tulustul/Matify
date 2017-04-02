export * from './models';
export * from './playlist.service';
export * from './playlist/playlist.component';
export * from './commands';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreModule } from 'core/core.module';
import { Plugin } from 'core/plugging';

import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistViewComponent } from './playlistView/playlistView.component';
import { PlaylistService } from './playlist.service';
import { PlaylistCommands } from './commands';

@Plugin()
@NgModule({
  declarations: [
    PlaylistComponent,
    PlaylistViewComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
  ],
  entryComponents: [
    PlaylistViewComponent,
  ],
  exports: [
    PlaylistComponent,
    PlaylistViewComponent,
  ],
  providers: [PlaylistService, PlaylistCommands],
})
export class Module { }
