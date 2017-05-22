import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { TracksService } from 'core/tracks';
import { Keybindings } from 'core/keybindings.service';
import { Theme } from 'core/theme.service';
import { ProxyServerService } from 'core/proxyServer.service';
import { Settings } from 'core/settings.service';
import { LibraryService } from 'core/library.service';

import { AudioErrorsNotifier } from 'plugins/audioErrorsNotifier';
import { TrackSchedulerService } from 'plugins/trackScheduler';
import { TrayService } from 'plugins/tray';
import { HistoryService } from 'plugins/history';

@Component({
  selector: 'mp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  pageVisible = false;

  componentClass: Function;

  component: ComponentRef<any>;

  initialized = false;

  @ViewChild('page', { read: ViewContainerRef })
  page: ViewContainerRef;

  constructor(
    private cfr: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private keybindings: Keybindings,
    trackSchedulerService: TrackSchedulerService,
    audioErrorsNotifier: AudioErrorsNotifier,
    trayService: TrayService,
    private theme: Theme,
    tracksService: TracksService,
    proxyServerService: ProxyServerService,
    settings: Settings,
    library: LibraryService,
    historyService: HistoryService,
  ) {
    settings.changes$.subscribe(() => {
      if (!this.initialized) {
        tracksService.init();
        proxyServerService.runProxyServer();
        this.initialized = true;
        this.cdr.markForCheck();
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
