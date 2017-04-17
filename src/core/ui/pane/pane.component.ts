import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  OnInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { PlaylistCommands } from 'plugins/playlist/commands';

import {
  PaneView,
  VIEWS_REGISTRY,
} from './';
import { PaneService } from './pane.service';

interface View {
  componentName: string;
  displayName: string;
  key: string;
  originalKey: string;
}

interface ComponentView {
  component: PaneView;
  view: View,
}

@Component({
  selector: 'mp-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.scss'],
})
export class PaneComponent implements OnInit, OnDestroy {

  @HostBinding('class') cssClass = 'mp-panel';

  searchTerm = '';

  views: View[] = [];

  viewsMap = new Map<string, View>();

  currentView: ComponentView = {
   component: undefined,
   view: undefined,
  };

  componentRef: ComponentRef<any>;

  key: string;

  displayNameSubscription: Subscription;

  serializationSubscription: Subscription;

  @ViewChild('content', {read: ViewContainerRef})
  content: ViewContainerRef;

  @ViewChild('searchBox')
  searchBox: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private paneService: PaneService,
    private playlistCommands: PlaylistCommands,
  ) {
    this.paneService.registerPane(this);
  }

  ngOnInit() {
    this.key = `pane`;
    const saveItems = JSON.parse(localStorage.getItem(this.key + 'items'));
    const viewKey = JSON.parse(localStorage.getItem(this.key + 'currentView'));
    if (saveItems) {
      this.views = saveItems;
      for (let view of this.views) {
        this.viewsMap.set(view.key, view);
      }
    }
    if (viewKey) {
      const view = this.views.find(i => i.key === viewKey);
      if (view) {
        this.openExistingView(view);
      }
    }
  }

  ngOnDestroy() {
    this.detach();
    this.paneService.unregisterPane(this);
  }

  private openNewView(viewConstructor: Function, originalKey: string, key: string) {
    const view = {
      componentName: viewConstructor.name,
      displayName: '',
      key: key,
      originalKey: originalKey,
    };

    this.views.push(view);
    this.viewsMap.set(key, view);

    this.createView(viewConstructor, key, originalKey);

    localStorage.setItem(this.key + 'items', JSON.stringify(this.views));

    this.cdr.markForCheck();

    return this.currentView.component;
  }

  private openExistingView(view: View) {
    const viewConstructor = VIEWS_REGISTRY.get(view.componentName);
    this.createView(viewConstructor, view.key, view.originalKey);
    this.deserializeCurrentView();
    this.cdr.markForCheck();
    return this.currentView.component;
  }

  openView(viewConstructor: Function, key: string = null) {
    // let storeKey = key || this.paneService.generateKey();
    const storeKey = `view-${viewConstructor.name}-${key}`;

    const view = this.viewsMap.get(storeKey);

    if (view) {
      return this.openExistingView(view);
    } else {
      return this.openNewView(viewConstructor, key, storeKey);
    }
  }

  closeView(view: View) {
    const index = this.views.indexOf(view);
    this.views.splice(index, 1);
    this.viewsMap.delete(view.key);
    this.detach();
    if (view.key === this.currentView.view.key && this.views.length) {
      this.openExistingView(this.views[Math.min(this.views.length - 1, index)]);
    }

    localStorage.setItem(this.key + 'items', JSON.stringify(this.views));
    this.cdr.markForCheck();
  }

  private createView(viewClass: any, key: string, originalKey: string) {
    this.detach();

    const factory = this.cfr.resolveComponentFactory(viewClass);
    this.componentRef = this.content.createComponent(factory);

    this.componentRef.instance.key = originalKey;

    const view = this.findViewByKey(key);
    this.currentView = {component: this.componentRef.instance, view};
    localStorage.setItem(this.key + 'currentView', JSON.stringify(key));

    const component = this.currentView.component;

    if (view.displayName) {
      component.displayName = view.displayName;
    } else if (component.displayName !== undefined) {
      view.displayName = component.displayName;
    } else {
      view.displayName = originalKey;
    }

    const displayName$ = component.displayName$;
    if (displayName$) {
      this.displayNameSubscription = displayName$.subscribe(displayName => {
        const currentItem = this.views.find(i => key === i.key);
        if (currentItem) {
          currentItem.displayName = displayName;
        }
        this.cdr.markForCheck();
      });
    }

    const serialization$ = component.serialization$;
    if (serialization$) {
      this.serializationSubscription = serialization$.subscribe(data => {
        localStorage.setItem(this.currentView.view.key, JSON.stringify(data));
      });
    }

    this.searchTerm = '';
  }

  deserializeCurrentView() {
    if (this.currentView.component.deserialize) {
      const data = JSON.parse(localStorage.getItem(this.currentView.view.key));
      this.currentView.component.deserialize(data);
    }
  }

  detach() {
    if (this.componentRef) {
      this.content.detach();
      this.componentRef.destroy();
      this.componentRef = null;
      if (this.displayNameSubscription) {
        this.displayNameSubscription.unsubscribe();
        this.displayNameSubscription = null;
      }
      if (this.serializationSubscription) {
        this.serializationSubscription.unsubscribe();
        this.serializationSubscription = null;
      }
    }
  }

  switchViewBy(offset: number) {
    const index = this.views.indexOf(this.currentView.view);
    let newIndex = index + offset;
    if (newIndex < 0) {
      newIndex += this.views.length;
    } else if (newIndex >= this.views.length) {
      newIndex -= this.views.length;
    }
    this.openExistingView(this.views[newIndex]);
  }

  private findViewByKey(key: string) {
    return this.views.find(v => v.key === key);
  }

  search() {
    if (this.currentView.component.search) {
      this.currentView.component.search(this.searchTerm);
    }
  }

  focusSearchBox() {
    const el = this.searchBox.nativeElement as HTMLElement;
    el.focus();
  }

  addPlaylist() {
    this.playlistCommands.newPlaylist();
  }

}
