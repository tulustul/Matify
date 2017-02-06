import { ReplaySubject } from 'rxjs';

export class EqualizerVisualizationService {

  _enabled$ = new ReplaySubject<boolean>();
  enabled$ = this._enabled$.asObservable();
  enabled = false;

  toogle() {
    this.enabled = !this.enabled;
    this._enabled$.next(this.enabled);
  }

}
