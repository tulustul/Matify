import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { PaneService } from 'core/ui/pane';

import { PlaylistService } from 'plugins/playlist';

import { SearchViewComponent } from './searchView.component';

@Injectable()
export class SearchCommands {

  constructor(
    private pane: PaneService,
    private playlist: PlaylistService,
  ) {}

  @Command({
    name: 'search.search',
    displayName: 'Search tracks',
  })
  search() {
    this.playlist.create('Search', false);
    this.pane.openView(SearchViewComponent, 'Search');
    this.pane.focusSearchbox();
  }

}
