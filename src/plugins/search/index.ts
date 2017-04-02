import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SearchComponent } from './search.component';
import { SearchViewComponent } from './searchView.component';
import { SearchService } from './search.service';
import { SearchCommands } from './commands';
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
  declarations: [
    SearchComponent,
    SearchViewComponent,
  ],
  exports: [
    SearchComponent,
    SearchViewComponent,
  ],
  entryComponents: [
    SearchComponent,
    SearchViewComponent
  ],
  providers: [
    SearchService,
    SearchCommands,
  ],
})
export class Module { }
