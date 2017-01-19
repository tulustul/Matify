import { Component, Output, EventEmitter } from '@angular/core';

import { LibraryComponent } from 'plugins/library/library.component';
import { SearchComponent } from 'plugins/search/search.component';

interface MenuItem {
  icon: string,
  name: string,
  component: Function,
}

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

  items: MenuItem[] = [
    {
      icon: 'search',
      name: 'Search',
      component: SearchComponent,
    }, {
      icon: 'thumb_up',
      name: 'Feed',
      component: null,
    }, {
      icon: 'playlist_play',
      name: 'Playlists',
      component: null,
    }, {
      icon: 'library_music',
      name: 'Library',
      component: LibraryComponent,
    }, {
      icon: 'font_download',
      name: 'Lyrics',
      component: null,
    }, {
      icon: 'info',
      name: 'Song Info',
      component: null,
    },
  ];

  constructor() {}

  selectItem(item: MenuItem) {
    this.change.next(item.component);
  }

}
