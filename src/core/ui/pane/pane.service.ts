import { Subject } from 'rxjs';

import * as Hashids from 'hashids';

import { ViewInstantiationParams } from './pane-view.interface';
import { PaneComponent } from './pane.component';

export class PaneService {

  panes: PaneComponent[] = [];

  currentPane: PaneComponent;

  hashids = new Hashids('mpsalt');

  registerPane(pane: PaneComponent) {
    this.panes.push(pane);
    this.currentPane = pane;
  }

  unregisterPane(pane: PaneComponent) {
    const index = this.panes.indexOf(pane);
    if (index !== -1) {
      this.panes.splice(index, 1);
    }
  }

  openNewView(viewClass: any) {
    return this.currentPane.openNewView(viewClass);
  }

  generateKey() {
    return this.hashids.encode([Date.now(), Math.round(Math.random() * 10000)]);
  }

}
