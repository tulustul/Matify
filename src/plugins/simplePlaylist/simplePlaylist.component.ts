import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { Track, TrackContainer, TracksService } from 'core/tracks';
import { AudioService } from 'core/audio.service';

import { PlaylistService, PlaylistCommands } from 'plugins/playlist';

type Item = Track|TrackContainer;

@Component({
  selector: 'mp-simple-playlist',
  templateUrl: './simplePlaylist.component.html',
  styleUrls: ['./simplePlaylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePlaylistComponent {

  _tracks: Track[] = [];

  _trackContainers: TrackContainer[] = [];

  @Output()
  endReached = new EventEmitter<void>();

  @Output()
  select = new EventEmitter<Track>();

  @Output()
  playing = new EventEmitter<Track>();

  playingTrack: Track;

  trackContainersMap = new Map<string, TrackContainer>();

  items: Item[] = [];

  constructor(
    private tracksService: TracksService,
    private playlist: PlaylistService,
    private playlistCommands: PlaylistCommands,
    private cdr: ChangeDetectorRef,
    private audio: AudioService,
  ) {
    audio.track$.subscribe(track => {
      this.playingTrack = track;
      this.cdr.markForCheck();
    });
  }

  play(track: Track, event: Event) {
    this.playing.next(track);
    this.audio.play(track);
    event.stopPropagation();
  }

  triggerEndReached() {
    this.endReached.next(null);
  }

  selectItem(item: Item) {
    if (!(<any>item).source) {
      item = item as TrackContainer;
      item.expanded = !item.expanded;
      this.buildItemsList();
    } else {
      this.addToPlaylist(item as Track);
    }
  }

  addToPlaylist(track: Track) {
    this.removeTrackFromResults(track);
    this.playlistCommands.addTrack(Object.assign({}, track));
  }

  removeTrackFromResults(track: Track) {
    const parent = this.trackContainersMap.get(track.uri);
    if (parent) {
      this.removeItemFromList(track, parent.tracks);
    } else {
      this.removeItemFromList(track, this.tracks);
    }

    this.buildItemsList();
    this.cdr.markForCheck();
  }

  removeItemFromList(item: Item, items: (Item)[]) {
    const index = items.indexOf(item);
    if (index !== -1) {
      items.splice(index, 1);
    }
  }

  addTrackContainer(trackContainer: TrackContainer, event: Event) {
    this.playlistCommands.addTracks(trackContainer.tracks);
    this.removeItemFromList(trackContainer, this.trackContainers);
    this.buildItemsList();
    event.stopPropagation();
  }

  buildItemsList() {
    this.trackContainersMap.clear();
    this.items = [];
    for (const tracksContainer of this.trackContainers) {
      for (const track of tracksContainer.tracks) {
        this.trackContainersMap.set(track.uri, tracksContainer);
      }
      this.items.push(tracksContainer);
      if (tracksContainer.expanded) {
        this.items = this.items.concat(tracksContainer.tracks);
      }
    }
    this.items = this.items.concat(this.tracks);
  }

  get tracks() {
    return this._tracks;
  }
  @Input() set tracks(tracks: Track[]) {
    this._tracks = tracks;
    this.buildItemsList();
  }

  get trackContainers() {
    return this._trackContainers;
  }
  @Input() set trackContainers(trackContainers: TrackContainer[]) {
    this._trackContainers = trackContainers;
    this.buildItemsList();
  }

  isChildTrack(track: Track) {
    return this.trackContainersMap.get(track.uri);
  }

}
