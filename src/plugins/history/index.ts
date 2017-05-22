export * from './history.component';
export * from './history.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { Module as SimplePlaylistModule } from 'plugins/simplePlaylist';

import { HistoryComponent } from './history.component';
import { HistoryService } from './history.service';

@Plugin({
   menuItems: [{
    icon: 'history',
    name: 'History',
    component: HistoryComponent,
  }],
})
@NgModule({
  declarations: [
    HistoryComponent,
  ],
  entryComponents: [HistoryComponent],
  exports: [HistoryComponent],
  providers: [HistoryService],
  imports: [
    CommonModule,
    CoreModule,
    SimplePlaylistModule,
  ],
})
class Module { }
