import {
  Component,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  ViewChild
} from '@angular/core';

import { PLUGGINS_DATA } from 'core/plugging';

@Component({
  selector: 'mp-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {

  @ViewChild('components', {read: ViewContainerRef})
  componentsRef: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {
    for (let componentClass of PLUGGINS_DATA.barComponents) {
      const factory = this.cfr.resolveComponentFactory(componentClass);
      this.componentsRef.createComponent(factory);
    }
  }

}
