import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import * as jss from 'jss/jss';

import { Settings } from './settings.service';

const fs = (window as any).nodeRequire('fs');

@Injectable()
export class Theme {

  panel: any;
  row: any;
  rowSelected: any;
  rowHovered: any;
  secondaryPanel: any;
  scrollbar: any;

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
        this._setGlobalStyles();
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

  private _setGlobalStyles() {
    jss.set('.mp-panel', this.panel);
    jss.set('.mp-secondary-panel', this.secondaryPanel);
    jss.set('.mp-row', this.row);
    jss.set('.mp-row-selected', this['row.selected']);
    jss.set('.mp-row-highlighted', this['row.highlighted']);
    jss.set('.mp-row-marked', this['row.marked']);
    jss.set('.mp-button', this.secondaryPanel);
    jss.set('::-webkit-scrollbar-thumb', this.scrollbar);
  }

}
