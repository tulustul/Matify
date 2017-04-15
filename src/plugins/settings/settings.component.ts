import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { PLUGGINS_DATA, Setting } from 'core/plugging';
import { Settings } from 'core/settings.service';

@Component({
  selector: 'mp-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  settingsMap = new Map<string, Setting[]>();

  constructor(
    private settings: Settings,
    private cdr: ChangeDetectorRef,
  ) {
    for (const setting of PLUGGINS_DATA.settings) {
      const module = setting.key.split('.')[0];
      if (!this.settingsMap.has(module)) {
        this.settingsMap.set(module, []);
      }
      this.settingsMap.get(module).push(setting);
    }
  }

  get modules() {
    return Array.from(this.settingsMap.keys());
  }

  settingsFor(module: string) {
    return this.settingsMap.get(module);
  }

}
