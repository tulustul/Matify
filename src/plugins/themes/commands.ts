import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { Theme } from 'core/theme.service';
import { PaletteService } from 'core/ui/palette';

@Injectable()
export class Commands {

  constructor(
    private themeService: Theme,
    private palette: PaletteService,
  ) {}

  @Command({displayName: 'Change theme'})
  changeTheme() {
    let currentTheme = this.themeService.currentTheme;

    this.themeService.getThemes().then(themeNames => {

      themeNames.splice(themeNames.indexOf(currentTheme), 1);
      themeNames = [currentTheme].concat(themeNames);

      let themes = themeNames.map(name => {
        return {name};
      });
      this.palette.openPalette(
        themes,
        ['name'],
        theme => this.saveTheme(theme.name),
        theme => this.themeService.loadTheme(theme.name),
      );
    });
  }

  saveTheme(theme: string) {
    this.themeService.loadTheme(theme);
    this.themeService.saveThemeToSettings();
  }

}
