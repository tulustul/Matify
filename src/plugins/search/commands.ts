import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { PaneService } from 'core/ui/pane';

import { SearchViewComponent } from './searchView.component';

@Injectable()
export class SearchCommands {

  constructor(private pane: PaneService) {}

  @Command({
    name: 'search.search',
    displayName: 'Search tracks',
  })
  search() {
    this.pane.openView(SearchViewComponent);
    this.pane.focusSearchbox();
  }

}
