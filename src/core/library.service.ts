import { Injectable } from '@angular/core';

import { AudioService } from 'core/audio.service';
import { Track, TrackWord } from 'core/tracks';

@Injectable()
export class LibraryService {

  constructor(audio: AudioService) {
    audio.track$.subscribe(track => {
      this.addTrack(track);
    });

    audio.playFinish$.subscribe((trackPlayTime) => {
      this.updateRank(trackPlayTime.track, trackPlayTime.playTime);
    });
  }

  async addTrack(track: Track) {
    track.plays = (track.plays || 0) + 1;
    const savedTrack = await Track.store.where('uri').equals(track.uri).first();
    if (!savedTrack) {
      await this._addTrack(track);
    } else {
      await this._updateTrack(track);
    }
  }

  async bulkAddTracks(tracks: Track[]) {
    await Track.store.bulkAdd(tracks);
    for (const track of tracks) {
      await this.index(track);
    }
  }

  private async _addTrack(track: Track) {
    await Track.store.add(track);
    this.index(track);
  }

  private async _updateTrack(track: Track) {
    await Track.store.update(track.id, track);
  }

  private async index(track: Track) {
    const trackWords = [].concat(
      ...this.getTrackWords(track, 'title'),
      ...this.getTrackWords(track, 'album'),
      ...this.getTrackWords(track, 'artist'),
    ).map(word => {
      return {
        trackId: track.id,
        word: word,
      };
    });

    await TrackWord.store.bulkAdd(trackWords);
  }

  private getTrackWords(track: Track, property: string) {
    let phrase = (track[property] || '').trim();
    return phrase ? phrase.split(' ') : [];
  }

  private updateRank(track: Track, playtime: number) {
    let rank = 2 * (playtime / (track.length || 0)) - 1;
    rank = Math.max(-1, Math.min(1, rank));
    track.rank = (track.rank || 0) + rank;
    this._updateTrack(track);
  }

  async getTracksByUris(trackUris: string[]) {
    const order = new Map<string, number>();
    trackUris.forEach((uri, index) => {
      order.set(uri, index);
    });
    const tracks = await Track.store.where('uri').anyOf(trackUris).toArray();
    return tracks.sort((a, b) => order.get(a.uri) - order.get(b.uri));
  }

}
