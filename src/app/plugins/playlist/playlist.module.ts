import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistComponent } from './playlist.component';
import { PlaylistService } from './playlist.service';
import { Commands } from './commands';
import { CoreModule } from 'app/core.module';

@NgModule({
  declarations: [
    PlaylistComponent
  ],
  imports: [CommonModule, CoreModule],
  exports: [PlaylistComponent],
  providers: [PlaylistService, Commands],
})
export class PlaylistModule { }
