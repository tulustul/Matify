import {
  Component,
  Output,
  EventEmitter,
  HostBinding,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { PLUGGINS_DATA, MenuItem } from 'core/plugging';

@Component({
  selector: 'mp-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  @HostBinding('class') cssClass = 'mp-panel';

  pages = PLUGGINS_DATA.menuItems;

  selectedItem: MenuItem;

  pageVisible = false;

  componentClass: Function;

  component: ComponentRef<any>;

  initialized = false;

  constructor(private cfr: ComponentFactoryResolver) {}

  @ViewChild('page', { read: ViewContainerRef })
  page: ViewContainerRef;

  selectPage(page: MenuItem) {
  }

  showSidebar(menuItem: MenuItem) {
    this.selectedItem = menuItem;

    if (this.component) {
      this.component.destroy();
      this.component = null;
    }

    const componentClass = menuItem.component;

    if (componentClass === this.componentClass && this.pageVisible) {
      this.pageVisible = false;
    } else {
      this.componentClass = componentClass;
      this.pageVisible = true;
      if (this.componentClass) {
        let factory = this.cfr.resolveComponentFactory(componentClass);
        this.component = this.page.createComponent(factory);
      }
    }
  }

}
