import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  PaneView,
  VIEWS_REGISTRY,
} from './';
import { PaneService } from './pane.service';

interface View {
  componentName: string;
  displayName: string;
  key: string;
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

  views: View[] = [];

  currentView: ComponentView = {
   component: undefined,
   view: undefined,
  };

  componentRef: ComponentRef<any>;

  key: string;

  displayNameSubscription: Subscription;

  @ViewChild('content', {read: ViewContainerRef})
  content: ViewContainerRef;

  constructor(
    private cfr: ComponentFactoryResolver,
    private paneService: PaneService,
  ) {
    this.paneService.registerPane(this);
  }

  ngOnInit() {
    this.key = `pane`;
    const saveItems = JSON.parse(localStorage.getItem(this.key + 'items'));
    const viewKey = JSON.parse(localStorage.getItem(this.key + 'view'));
    if (saveItems) {
      this.views = saveItems;
    }
    if (viewKey) {
      const view = this.views.find(i => i.key === viewKey);
      if (view) {
        this.openView(view);
      }
    }
  }

  ngOnDestroy() {
    this.detach();
    this.paneService.unregisterPane(this);
  }

  openNewView(viewClass: any) {
    const componentKey = 'view' + this.paneService.generateKey();

    this.views.push({
      componentName: viewClass.name,
      displayName: '',
      key: componentKey,
    });

    this.createView(viewClass, componentKey);

    localStorage.setItem(this.key + 'items', JSON.stringify(this.views));

    return this.currentView.component;
  }

  openView(view: View) {
    const viewClass = VIEWS_REGISTRY.get(view.componentName)
    this.createView(viewClass, view.key);

    const data = JSON.parse(localStorage.getItem(this.currentView.view.key));
    this.currentView.component.deserialize(data);
  }

  closeView(view: View) {
    const index = this.views.indexOf(view);
    this.views.splice(index, 1);
    if (view.key === this.currentView.view.key && this.views.length) {
      this.openView(this.views[Math.min(this.views.length - 1, index)]);
    }

    localStorage.setItem(this.key + 'items', JSON.stringify(this.views));
  }

  private createView(viewClass: any, key: string) {
    if (this.componentRef) {
      this.detach();
    }

    const factory = this.cfr.resolveComponentFactory(viewClass);
    this.componentRef = this.content.createComponent(factory);

    const view = this.findViewByKey(key);
    this.currentView = {component: this.componentRef.instance, view};
    localStorage.setItem(this.key + 'view', JSON.stringify(key));

    const displayName$ = this.currentView.component.displayName$;
    this.displayNameSubscription = displayName$.subscribe(displayName => {
      const currentItem = this.views.find(i => key === i.key);
      if (currentItem) {
        currentItem.displayName = displayName;
      }
    });
  }

  detach() {
    const data = this.currentView.component.serialize();
    localStorage.setItem(this.currentView.view.key, JSON.stringify(data));
    this.content.detach();
    this.componentRef.destroy();
    this.displayNameSubscription.unsubscribe();
  }

  switchViewBy(offset: number) {
    const index = this.views.indexOf(this.currentView.view);
    let newIndex = index + offset;
    if (newIndex < 0) {
      newIndex += this.views.length;
    } else if (newIndex >= this.views.length) {
      newIndex -= this.views.length;
    }
    this.openView(this.views[newIndex]);
  }

  private findViewByKey(key: string) {
    return this.views.find(v => v.key === key);
  }

}
