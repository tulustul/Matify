import { Injectable } from '@angular/core';

import { Command } from 'core/commands';

import { PaneService } from './pane.service';

@Injectable()
export class PaneCommands {

  constructor(private paneService: PaneService) {}

  @Command({
    name: 'panes.closeView',
    isVisibleInPallete: false,
  })
  closeView() {
    const pane = this.paneService.currentPane;
    pane.closeView(pane.currentView.view);
  }

  @Command({
    name: 'panes.switchViewBy',
    isVisibleInPallete: false,
  })
  switchViewBy(offset: number) {
    this.paneService.currentPane.switchViewBy(offset);
  }

}
