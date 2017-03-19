import {
  Component,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { PAGES, MenuItem } from 'core/plugging';

@Component({
  selector: 'mp-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  @HostBinding('class') cssClass = 'mp-secondary-panel';

  @Output()
  change = new EventEmitter<Function>();

  pages = PAGES;

  selectPage(page: MenuItem) {
    this.change.next(page.component);
  }

}
