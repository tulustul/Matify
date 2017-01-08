import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistComponent } from './playlist.component';

@NgModule({
  declarations: [
    PlaylistComponent,
  ],
  imports: [CommonModule],
  exports: [PlaylistComponent],
})
export class PlaylistModule { }
