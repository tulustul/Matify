import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { PaletteService } from 'core/ui/palette';
import { PLUGGINS_DATA } from 'core/plugging';
import { Settings } from 'core/settings.service';

import { VisualizationService } from './visualization.service';
import { Visualization } from './visualization.interface';

@Injectable()
export class Commands {

  constructor(
    private visualization: VisualizationService,
    private palette: PaletteService,
    private settings: Settings,
  ) {}

  @Command({displayName: 'Toogle visualization'})
  toogleVisualization() {
    this.visualization.toogle();
  }

  @Command({displayName: 'Change visualization'})
  changeVisualization() {
    setTimeout(() => {
      this.palette.openPalette(
        PLUGGINS_DATA.visualizations,
        ['name'],
        vis => this.saveVisualization(vis),
        vis => this.visualization.visualization = vis,
      );
    });
  }

  saveVisualization(visualization: Visualization) {
    this.visualization.visualization = visualization;
    this.settings.userSettings.visualization = visualization.name;
    this.settings.saveUserSettings();
  }

}
