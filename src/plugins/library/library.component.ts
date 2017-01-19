import { Component } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class LibraryComponent {

}
