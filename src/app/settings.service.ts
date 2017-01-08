import { ReplaySubject } from 'rxjs';

const fs = (window as any).nodeRequire('fs');

export class Settings {

  private _changes$ = new ReplaySubject<Settings>(1);
  changes$ = this._changes$.asObservable();

  keybindings: {
    keys: string[],
    command: string,
    context: string,
    args: (string | number | boolean)[],
  }[]

  constructor() {
    fs.readFile('settings.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let settings = JSON.parse(data);
        Object.assign(this, settings);
        this._changes$.next(this);
      }
    });
  }
}
