import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { Settings } from './settings.service';

const fs = (window as any).nodeRequire('fs');

@Injectable()
export class Theme {

  private _changes$ = new ReplaySubject<void>(1);
  changes$ = this._changes$.asObservable();

  currentTheme: string;

  private linkNode: HTMLLinkElement;

  constructor(private settings: Settings) {
    settings.changes$.subscribe(() => {
      this.loadTheme(settings.theme);
    });
  }

  loadTheme(themeName: string) {
    this.currentTheme = themeName;
    this._changes$.next(null);
    if (!this.linkNode) {
      this.createLinkNode();
    }
    this.linkNode.href = `themes/${themeName}.css`;
  }

  private createLinkNode() {
    this.linkNode = document.createElement('link');
    this.linkNode.type = 'text/css';
    this.linkNode.rel = 'stylesheet';

    document.head.appendChild(this.linkNode);
  }

  getThemes() {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir('dist/themes', async (err, files: string[]) => {
        if (err) {
          reject(`getting themes error: ${err}`);
        } else {
          files = files.filter(
            f => f.endsWith('.css')
          ).map(f => f.slice(0, f.length - '.css'.length));
          resolve(files);
        }
      });
    });
  }

  saveThemeToSettings() {
    this.settings.userSettings.theme = this.currentTheme;
    this.settings.saveUserSettings();
  }

}
