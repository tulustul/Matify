import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreModule } from 'core/core.module';

import { PlaylistComponent } from './playlist.component';
import { PlaylistService } from './playlist.service';
import { Commands } from './commands';

@NgModule({
  declarations: [
    PlaylistComponent,
  ],
  imports: [CommonModule, CoreModule, FormsModule],
  exports: [PlaylistComponent],
  providers: [PlaylistService, Commands],
})
export class PlaylistModule { }
