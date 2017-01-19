import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';

import { Keybindings } from './keybindings.service';
import { Theme } from './theme.service';
import { TrackSchedulerService } from 'plugins/trackScheduler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.color]': 'theme["colors.font"]',
  },
})
export class AppComponent {

  pageVisible = false;

  componentClass: Function;

  component: ComponentRef<any>;

  @ViewChild('page', { read: ViewContainerRef })
  page: ViewContainerRef;

  constructor(
    private cfr: ComponentFactoryResolver,
    private keybindings: Keybindings,
    trackSchedulerService: TrackSchedulerService,
    private theme: Theme,
  ) {}

  showPage(componentClass: any) {
    if (this.component) {
      this.component.destroy();
      this.component = null;
    }

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
