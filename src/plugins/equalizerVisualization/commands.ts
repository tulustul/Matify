import { Injectable } from '@angular/core';

import { Command } from 'core/commands';
import { ModalsService } from 'core/modals';
import { NotificationsService } from 'core/notifications';
import { PaletteService } from 'core/palette';

import { EqualizerVisualizationService } from './equalizerVisualization.service';

@Injectable()
export class Commands {

  constructor(
    private equalizerVisualization: EqualizerVisualizationService,
  ) {}

  @Command({displayName: 'Toogle visualization'})
  toogleVisualization() {
    this.equalizerVisualization.toogle();
  }

}
