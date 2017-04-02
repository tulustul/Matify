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

import { PlaylistService } from '../playlist.service';
import { PlaylistsService, PlaylistWithTracks } from '../playlists.service';
import { Playlist } from '../models';

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

  key: string;

  playingTrack: Track;

  filteredTracks: Track[] = [];

  tracks: Track[] = [];

  displayName$ = this.playlist.playlist$.map(p => p.name);

  needSerialization$ = this.displayName$;

  @ViewChild(ListComponent)
  list: ListComponent;

  constructor(
    public playlist: PlaylistService,
    // public playlists: PlaylistsService,
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
    playlist.tracks$.subscribe(tracks => {
      this.tracks = tracks;
      this.filteredTracks = this.tracks;
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.playlist.open(this.key);
    this.list.focus();
    // this.playlist.searchFocus$.subscribe(() => this.focusSearch());
  }

  // async setPlaylist(name: string) {
  //   const playlist = await this.playlists.getPlaylist(name);
  //   this.playlistService.playlist = playlist;
  //   this.playlist = playlist;
  //   this._displayName$.next(playlist.name);
  //   // this.changeDetectorRef.markForCheck();
  // }

  // @Input() set playlist(playlist: PlaylistWithTracks) {
  //   this._playlist = playlist$
  //   this._playlist$.subscribe(playlist => {
  //     this.playlist = playlist;
  //     this._displayName$.next(playlist.name);
  //     this.changeDetectorRef.markForCheck();
  //   })
  // }

  // serialize(): SerializationData {
  //  return {
  //    playlistName: this.playlist.playlist.name,
  //   //  playlistName: this.playlist.name,
  //  };
  // }

  // async deserialize(data: SerializationData) {
  //   await this.playlist.open(data.playlistName);
  //   // this.setPlaylist(data.playlistName);
  // };

  activate() {
    // this.playlistService.setPlaylist
  }

  play(track: Track) {
    this.playlist.play(track);
  }

  // loadplaylistService(name: string) {
  //   this.playlists.openPlaylist(name);
  // }

  // closePlaylist(name: string) {
  //   this.playlists.closePlaylist(name);
  // }

  search(searchTerm: string) {
    this.filteredTracks = this.filterService.filter(
      searchTerm, this.playlist.tracks, ['title', 'album', 'artist'],
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

  // get tracks() {
  //   return this.playlist ? this.playlist.tracks : [];
  // }

}
