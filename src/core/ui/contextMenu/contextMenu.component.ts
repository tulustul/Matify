import {
  Component,
  ChangeDetectorRef,
} from '@angular/core';

import { ContextMenuService } from './contextMenu.service';
import { ContextMenu, ContextMenuItem } from './contextMenu.interface';

@Component({
  selector: 'mp-context-menu',
  templateUrl: './contextMenu.component.html',
  styleUrls: ['./contextMenu.component.scss'],
})
export class ContextMenuComponent {

  menu: ContextMenu;

  constructor(
    public contextMenu: ContextMenuService,
    private cdr: ChangeDetectorRef,
  ) {
    this.contextMenu.menu$.subscribe(menu => {
      this.menu = menu;
      this.cdr.markForCheck();
    });
  }

  triggerAction(item: ContextMenuItem) {
    this.contextMenu.triggerAction(item);
  }

}
