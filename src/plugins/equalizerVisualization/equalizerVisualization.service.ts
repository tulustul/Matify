import { ReplaySubject } from 'rxjs';

import { ipcRenderer } from 'electron';

export class EqualizerVisualizationService {

  _enabled$ = new ReplaySubject<boolean>();
  enabled$ = this._enabled$.asObservable();
  _enabled = false;

  globallyEnabled = true;

  constructor() {
    ipcRenderer.on('hide', () => this.enabled = false);
    ipcRenderer.on('show', () => this.enabled = true);
  }

  set enabled(enabled: boolean) {
    if (this.globallyEnabled) {
      this._enabled = enabled;
      this._enabled$.next(this.enabled);
    }
  }
  get enabled() {
    return this._enabled;
  }

  toogle() {
    this.globallyEnabled = !this.globallyEnabled;
    this._enabled = this.globallyEnabled;
    this._enabled$.next(this.enabled);
  }

}
