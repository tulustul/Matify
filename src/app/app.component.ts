import { Component } from '@angular/core';

import { Keybindings } from './keybindings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private keybindings: Keybindings) {}

}
