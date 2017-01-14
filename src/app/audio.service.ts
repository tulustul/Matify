import { ReplaySubject } from 'rxjs';

import { Track } from 'app/track';

export enum AudioState {
  playing,
  paused,
  stopped,
  buffering,
}

export class AudioService {

  private _state$ = new ReplaySubject<AudioState>(1);
  state$ = this._state$.asObservable();
  state: AudioState;

  private _track$ = new ReplaySubject<Track>(1);
  track$ = this._track$.asObservable();
  track: Track;

  private _position$ = new ReplaySubject<number>(1);
  position$ = this._position$.throttleTime(250);
  position: number;

  private _duration$ = new ReplaySubject<number>(1);
  duration$ = this._duration$.asObservable();
  duration: number;

  private _trackend$ = new ReplaySubject<void>(1);
  trackend$ = this._trackend$.asObservable();

  audio = new Audio();

  constructor() {
    this.audio.playbackRate
    this.audio.addEventListener('timeupdate', (e: Event) => {
      this.position = this.audio.currentTime;
      this._position$.next(this.position);
    });

    this.audio.addEventListener('loadedmetadata', (e: Event) => {
      if (!this.track.length) {
        this.track.length = this.audio.duration;
        Track.store.update(this.track.id, this.track);
        this.duration = this.track.length;
        this._duration$.next(this.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      this._trackend$.next(null);
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
    this._state$.next(AudioState.playing);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this._state$.next(AudioState.stopped);
  }

  togglePause() {
    if (this.audio.paused) {
      this.audio.play();
      this.state = AudioState.playing;
    } else {
      this.audio.pause();
      this.state = AudioState.paused;
    }
    this._state$.next(this.state);
  }

  seek(position: number) {
    this.audio.currentTime = position;
  }

  seekBy(offset: number) {
    this.seek(this.position + offset);
  }

}
