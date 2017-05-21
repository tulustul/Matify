export * from './discover.component';
export * from './discover.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { Module as SimplePlaylistModule } from 'plugins/simplePlaylist';

import { DiscoverComponent } from './discover.component';
import { DiscoverService } from './discover.service';

@Plugin({
   menuItems: [{
    icon: 'stars',
    name: 'Discover',
    component: DiscoverComponent,
  }],
})
@NgModule({
  declarations: [
    DiscoverComponent,
  ],
  entryComponents: [DiscoverComponent],
  exports: [DiscoverComponent],
  providers: [DiscoverService],
  imports: [
    CommonModule,
    CoreModule,
    SimplePlaylistModule,
  ],
})
class Module { }
