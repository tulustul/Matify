import { Component } from '@angular/core';

import { Keybindings } from './keybindings.service';
import { TrackSchedulerService } from 'app/plugins/trackScheduler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private keybindings: Keybindings,
    trackSchedulerService: TrackSchedulerService,
  ) {}

}
