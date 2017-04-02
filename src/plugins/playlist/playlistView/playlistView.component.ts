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
  templateUrl: './playlistView.component.html',
  styleUrls: ['./playlistView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistViewComponent implements PaneView {

  key: string;

  private _displayName$ = new ReplaySubject<string>(1);
  displayName$ = this._displayName$.asObservable();

  static asView(playlistName) {
    return {
       componentClass: PlaylistViewComponent,
       options: {playlistName},
    };
  }

  serialize(): SerializationData {
   return {
     playlistName: null,
    //  playlistName: this.playlist.name,
   };
  }

  deserialize(data: SerializationData) {
    // this.setPlaylist(data.playlistName);
  };

  activate() {
    // this.playlistService.setPlaylist
  }

}
