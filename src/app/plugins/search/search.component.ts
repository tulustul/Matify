import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Track } from 'app/track';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class SearchComponent {

  searchTerm: string;

  tracks: Track[];

  async search() {
    this.tracks = await Track.store
      .where('artist')
      .startsWithIgnoreCase(this.searchTerm).toArray();
  }

}
