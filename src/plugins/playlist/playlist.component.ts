import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
  ElementRef,
  HostBinding,
} from '@angular/core';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { FilterService } from 'core/filter.service';
import { ListComponent } from 'core/ui/list';

import { PlaylistService } from './playlist.service';
import { PlaylistsService } from './playlists.service';

@Component({
  selector: 'mp-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit {

  @HostBinding('class') cssClass = 'mp-panel';

  playingTrack: Track;

  tracks: Track[] = [];

  filteredTracks: Track[] = [];

  searchQuery: string;

  @ViewChild(ListComponent)
  list: ListComponent;

  @ViewChild('searchBox')
  searchBox: ElementRef;

  constructor(
    public playlist: PlaylistService,
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
      this.searchQuery = '';
      this.tracks = tracks;
      this.filteredTracks = this.tracks;
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.list.focus();
    this.playlist.searchFocus$.subscribe(() => this.focusSearch());
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

  focusSearch() {
    let searchBox = this.searchBox.nativeElement as HTMLElement;
    searchBox.focus();
  }

  tracksEqual(trackA: Track, trackB: Track) {
    if (trackA && trackB) {
      return trackA.uri === trackB.uri;
    }
  }

}
