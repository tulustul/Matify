import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

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
  ],
  declarations: [
    SimilarTracksComponent
  ],
  entryComponents: [
    SimilarTracksComponent
  ],
})
export class Module { }
