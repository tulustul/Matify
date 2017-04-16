import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'mp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {

  @Input() items: any[];

  @Input() selectedItem: any;

  @Output() select = new EventEmitter<any>();

  @Output() close = new EventEmitter<any>();

  @Output() addTab = new EventEmitter<void>();

  selectOrCloseItem(event: MouseEvent, item: any) {
    if (event.button === 1) {
      this.closeItem(item);
    } else {
      this.select.next(item);
    }
  }

  closeItem(item: any) {
    this.close.next(item);
  }

  addNewTab() {
    this.addTab.next(null);
  }

}
