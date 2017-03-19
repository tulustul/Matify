import {
  Component,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { PLUGGINS_DATA, MenuItem } from 'core/plugging';

@Component({
  selector: 'mp-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  @HostBinding('class') cssClass = 'mp-secondary-panel';

  @Output()
  change = new EventEmitter<Function>();

  pages = PLUGGINS_DATA.menuItems;

  selectPage(page: MenuItem) {
    this.change.next(page.component);
  }

}
