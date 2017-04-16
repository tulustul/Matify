import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

import { ContextMenuService } from 'core/ui/contextMenu';

import { TrackSchedulerService } from './trackScheduler.service';

@Component({
  selector: 'mp-order-chooser',
  templateUrl: './orderChooser.component.html',
  styleUrls: ['./orderChooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderChooserComponent {

  ICONS = {
    random: 'compare_arrows',
    oneByOne: 'play_for_work',
  };

  icon: string;

  @HostBinding()
  class = 'mp-primary';

  constructor(
    private trackScheduler: TrackSchedulerService,
    private contextMenu: ContextMenuService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {
    trackScheduler.order$.subscribe(order => {
      this.icon = this.ICONS[order];
      this.cdr.markForCheck();
    });
  }

  showMenu(event: Event) {
    event.stopPropagation();
    this.contextMenu.showMenuForElement(this.elementRef.nativeElement, {
      title: 'Schedule playlist tracks',
      items: [
        {
          name: 'randomly',
          command: 'trackScheduler.randomOrder',
          icon: this.ICONS.random,
        },
        {
          name: 'one by one',
          command: 'trackScheduler.oneByOneOrder',
          icon: this.ICONS.oneByOne,
        },
      ],
    });
  }

}
