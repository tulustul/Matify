import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { PLUGGINS_DATA, MenuItem } from 'core/plugging';

@Component({
  selector: 'mp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {

  @Input() items: string[];

  @Input() selectedItem: string;

  @Output() select = new EventEmitter<string>();

  @Output() close = new EventEmitter<string>();

  selectOrCloseItem(event: MouseEvent, item: string) {
    if (event.button === 1) {
      this.closeItem(item);
    } else {
      this.select.next(item);
    }
  }

  closeItem(item: string) {
    this.close.next(item);
  }

}
