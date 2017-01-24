import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
} from '@angular/core';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { ListComponent } from 'core/list';
import { FilterService } from 'core/filter.service';

import { PlaylistService } from './playlist.service';
import { PlaylistsService } from './playlists.service';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  host: {
    '[hidden]': '!opened',
    'class': 'mp-panel',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit {

  playingTrack: Track;

  tracks: Track[] = [];

  filteredTracks: Track[] = [];

  searchQuery: string;

  @ViewChild(ListComponent)
  list: ListComponent;

  constructor(
    private playlist: PlaylistService,
    private playlists: PlaylistsService,
    private audio: AudioService,
    private filterService: FilterService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      this.list.scrollViewToItem(this.playingTrack);
      changeDetectorRef.markForCheck();
    });
    playlist.tracks$.subscribe(tracks => {
      this.tracks = tracks;
      this.filteredTracks = this.tracks;
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.list.focus();
  }

  play(track: Track) {
    this.playlist.play(track);
  }

  loadOrClosePlaylist(event: MouseEvent, name: string) {
    if (event.button === 1) {
      this.closePlaylist(name);
    } else {
      this.playlists.openPlaylist(name);
    }
  }

  closePlaylist(name: string) {
    this.playlists.closePlaylist(name);
  }

  search() {
    this.filteredTracks = this.filterService.filter(
      this.searchQuery, this.tracks, ['title', 'album', 'artist'],
    );
    this.changeDetectorRef.markForCheck();
  }

}
