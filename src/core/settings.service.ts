import { ReplaySubject } from 'rxjs';

import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as os from 'os';

export class Settings {

  DEFAULT_SETTINGS_PATH = 'settings.json';

  USER_SETTINGS_PATH = (
    `${os.homedir()}/.config/ElectronMusicPlayer/settings.json`
  );

  theme: string;

  userSettings: any = {};

  private _changes$ = new ReplaySubject<Settings>(1);
  changes$ = this._changes$.asObservable();

  keybindings: {
    keys: string[],
    command: string,
    context: string,
    args: (string | number | boolean)[],
  }[]

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    await this.loadSettingsFromFile(this.DEFAULT_SETTINGS_PATH, this);
    await this.loadUserSettings();

    Object.assign(this, this.userSettings);

    this._changes$.next(this);
  }

  private loadSettingsFromFile(filepath, target: any) {
    return new Promise<void>((resolve, reject) => {
      fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          let settings = JSON.parse(data);
          Object.assign(target, settings);
          resolve();
        }
      });
    });
  }

  private async loadUserSettings() {
    try {
      await this.loadSettingsFromFile(
        this.USER_SETTINGS_PATH,
        this.userSettings,
      );
    } catch (e) {
      this.createUserSettings();
    }
  }

  private createUserSettings() {
     mkdirp(path.dirname(this.USER_SETTINGS_PATH), err => {
      if (err) {
        this.logCreatingUserSettingsError(err);
      } else {
        fs.writeFile(this.USER_SETTINGS_PATH, '{\n\n}', err => {
          if (err) {
            this.logCreatingUserSettingsError(err);
          }
        });
      }
    });
  }

  private logCreatingUserSettingsError(err) {
    console.error(`Cannot create user settings file: ${err}`);
  }

  public saveUserSettings() {
    fs.writeFile(
      this.USER_SETTINGS_PATH,
      JSON.stringify(this.userSettings, null, 2),
    );
  }

}
