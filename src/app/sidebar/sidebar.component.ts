import { Component } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    'class': 'mp-secondary-panel',
  },
})
export class SidebarComponent {

  constructor() {}

}
