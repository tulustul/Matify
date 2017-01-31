import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
} from '@angular/core';

import { TracksService } from 'core/tracks';
import { Keybindings } from 'core/keybindings.service';
import { Theme } from 'core/theme.service';
import { ProxyServerService } from 'core/proxyServer.service';
import { Settings } from 'core/settings.service';

import { TrackSchedulerService } from 'plugins/trackScheduler';
import { TrayService } from 'plugins/tray';

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

  initialized = false;

  constructor(
    private cfr: ComponentFactoryResolver,
    private keybindings: Keybindings,
    trackSchedulerService: TrackSchedulerService,
    trayService: TrayService,
    private theme: Theme,
    tracksService: TracksService,
    proxyServerService: ProxyServerService,
    settings: Settings,
  ) {
    settings.changes$.subscribe(() => {
      if (!this.initialized) {
        tracksService.init();
        proxyServerService.runProxyServer();
        this.initialized = true;
      }
    });
  }

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
