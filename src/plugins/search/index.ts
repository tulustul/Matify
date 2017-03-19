import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { Module as PlaylistModule } from 'plugins/playlist';

@Plugin({
  menuItems: [{
    icon: 'search',
    name: 'Search',
    component: SearchComponent,
  }],
})
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlaylistModule,
    CoreModule,
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
  entryComponents: [SearchComponent],
  providers: [SearchService],
})
export class Module { }
