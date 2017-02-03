import {
  Component,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  ViewChild
} from '@angular/core';

import { BAR_COMPONENTS } from 'core/plugging';

@Component({
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {

  @ViewChild('components', {read: ViewContainerRef})
  componentsRef: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {
    for (let componentClass of BAR_COMPONENTS) {
      let factory = this.cfr.resolveComponentFactory(componentClass);
      this.componentsRef.createComponent(factory);
    }
  }

}
