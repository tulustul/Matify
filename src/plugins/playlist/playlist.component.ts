import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  Input,
  OnInit,
  ElementRef,
  HostBinding,
} from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { Track } from 'core/tracks';
import { AudioService } from 'core/audio.service';
import { FilterService } from 'core/filter.service';
import { ListComponent } from 'core/ui/list';
import { PaneView, View} from 'core/ui/pane';

import { PlaylistService } from './playlist.service';
import { PlaylistsService, PlaylistWithTracks } from './playlists.service';
import { Playlist } from './models';

interface SerializationData {
  playlistName: string;
}

@View
@Component({
  selector: 'mp-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit, PaneView {

  playingTrack: Track;

  filteredTracks: Track[] = [];

  searchQuery: string;

  playlist: PlaylistWithTracks;

  private _displayName$ = new ReplaySubject<string>(1);
  displayName$ = this._displayName$.asObservable();

  @ViewChild(ListComponent)
  list: ListComponent;

  @ViewChild('searchBox')
  searchBox: ElementRef;

  constructor(
    public playlistService: PlaylistService,
    public playlists: PlaylistsService,
    private audio: AudioService,
    private filterService: FilterService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      if (this.list) {
        this.list.scrollViewToItem(this.playingTrack);
      }
      changeDetectorRef.markForCheck();
    });
    // playlistService.tracks$.subscribe(tracks => {
    //   this.searchQuery = '';
    //   this.tracks = tracks;
    //   this.filteredTracks = this.tracks;
    //   changeDetectorRef.markForCheck();
    // });
  }

  ngOnInit() {
    this.list.focus();
    // this.playlist.searchFocus$.subscribe(() => this.focusSearch());
  }

  serialize(): SerializationData {
   return {
     playlistName: this.playlist.name,
   };
  }

  deserialize(data: SerializationData) {
    this.setPlaylist(data.playlistName);
  };

  activate() {
    // this.playlistService.setPlaylist
  }

  async setPlaylist(name: string) {
    const playlist = await this.playlists.getPlaylist(name);
    this.playlistService.playlist = playlist;
    this.playlist = playlist;
    this._displayName$.next(playlist.name);
    // this.changeDetectorRef.markForCheck();
  }

  // @Input() set playlist(playlist: PlaylistWithTracks) {
  //   this._playlist = playlist$
  //   this._playlist$.subscribe(playlist => {
  //     this.playlist = playlist;
  //     this._displayName$.next(playlist.name);
  //     this.changeDetectorRef.markForCheck();
  //   })
  // }

  play(track: Track) {
    this.playlistService.play(track);
  }

  // loadplaylistService(name: string) {
  //   this.playlists.openPlaylist(name);
  // }

  // closePlaylist(name: string) {
  //   this.playlists.closePlaylist(name);
  // }

  search() {
    this.filteredTracks = this.filterService.filter(
      this.searchQuery, this.playlist.tracks, ['title', 'album', 'artist'],
    );
    this.changeDetectorRef.markForCheck();
  }

  // focusSearch() {
  //   let searchBox = this.searchBox.nativeElement as HTMLElement;
  //   searchBox.focus();
  // }

  tracksEqual(trackA: Track, trackB: Track) {
    if (trackA && trackB) {
      return trackA.uri === trackB.uri;
    }
  }

  get tracks() {
    return this.playlist ? this.playlist.tracks : [];
  }

}
