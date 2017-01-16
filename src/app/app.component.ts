import { Component } from '@angular/core';

import { Keybindings } from './keybindings.service';
import { TrackSchedulerService } from 'app/plugins/trackScheduler';
import { Theme } from 'app/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.color]': 'theme["colors.font"]',
  },
})
export class AppComponent {

  constructor(
    private keybindings: Keybindings,
    trackSchedulerService: TrackSchedulerService,
    private theme: Theme,
  ) {}

}
