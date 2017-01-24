import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Track, TracksService } from 'core/tracks';
import { Column } from 'core/list';

import { PlaylistService } from 'plugins/playlist/playlist.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class SearchComponent {

  waiting = false;

  searchTerm: string;

  tracks: Track[] = [];

  columns: Column[] = [
    {getter: (item: Track) => `${item.title} - ${item.artist}`},
  ];

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
  ) {}

  search() {
    this.waiting = true;
    this.tracks = [];

    this.tracksService.search(this.searchTerm).subscribe(
      tracks => this.tracks = this.tracks.concat(tracks),
      () => {},
      () => this.waiting = false,
    );
  }

  addToPlaylist(track: Track) {
    this.playlist.addTrack(Object.assign({}, track));
  }

  addAllToPlaylist() {
    this.playlist.addTracks(this.tracks);
  }

}
