import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { PaneService } from 'core/ui/pane';

import { ShortcutsViewComponent } from './shortcuts.component';

@Injectable()
export class ShortcutsCommands {

  constructor(private pane: PaneService) {}

  @Command({
    name: 'shortcuts.open',
    displayName: 'Open shortcuts list',
  })
  openShortcuts() {
    this.pane.openView(ShortcutsViewComponent);
  }

}
