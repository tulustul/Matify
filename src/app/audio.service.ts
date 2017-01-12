import { ReplaySubject } from 'rxjs';

import { Track } from 'app/track';

export enum State {
  playing,
  paused,
  stopped,
  buffering,
}

export class AudioService {

  track: Track;

  private _state$ = new ReplaySubject<State>(1);
  state$ = this._state$.asObservable();

  private _track$ = new ReplaySubject<Track>(1);
  track$ = this._track$.asObservable();

  private _position$ = new ReplaySubject<number>(1);
  position$ = this._position$.throttleTime(250);

  private _duration$ = new ReplaySubject<number>(1);
  duration$ = this._duration$.asObservable();

  audio = new Audio();

  constructor() {
    this.audio.playbackRate
    this.audio.addEventListener('timeupdate', (e: Event) => {
      this._position$.next(this.audio.currentTime);
    });
    // setInterval(() => {
    //   this._position$.next(this.audio.currentTime);
    // }, 50);

    this.audio.addEventListener('loadedmetadata', (e: Event) => {
      if (!this.track.length) {
        this.track.length = this.audio.duration;
        Track.store.update(this.track.id, this.track);
        this._duration$.next(this.track.length);
      }
    });
  }

  play(track: Track) {
    this.track = track;
    this._track$.next(this.track);
    if (this.track.length) {
      this._duration$.next(this.track.length);
    }

    this.audio.src = this.track.uri;
    this.audio.load();
    this.audio.play();
  }

  stop() {

  }

  pause() {

  }

  seek() {

  }

}
