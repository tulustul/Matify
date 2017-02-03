import { Component, Output, EventEmitter } from '@angular/core';

import { PAGES, MenuItem } from 'core/plugging';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    'class': 'mp-secondary-panel',
  },
})
export class SidebarComponent {

  @Output()
  change = new EventEmitter<Function>();

  pages = PAGES;

  selectPage(page: MenuItem) {
    this.change.next(page.component);
  }

}
