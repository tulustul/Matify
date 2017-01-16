import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { Settings } from './settings.service';

const fs = (window as any).nodeRequire('fs');

@Injectable()
export class Theme {

  private _changes$ = new ReplaySubject<Theme>(1);
  changes$ = this._changes$.asObservable();

  currentTheme: string;

  constructor(settings: Settings) {
    settings.changes$.subscribe(() => {
      this.loadTheme(settings.theme);
    });
  }

  loadTheme(themeName: string) {
    fs.readFile(`themes/${themeName}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.currentTheme = themeName;
        let settings = JSON.parse(data);
        Object.assign(this, settings);
        this._changes$.next(this);
      }
    });
  }

  getThemes() {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir('themes', async (err, files: string[]) => {
        if (err) {
          reject(`getting themes error: ${err}`);
        } else {
          files = files.filter(
            f => f.endsWith('.json')
          ).map(f => f.slice(0, f.length - '.json'.length));
          resolve(files);
        }
      });
    });
  }

}
