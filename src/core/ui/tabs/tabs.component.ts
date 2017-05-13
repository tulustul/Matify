import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'mp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {

  @Input() items: any[];

  @Input() selectedItem: any;

  @Output() select = new EventEmitter<any>();

  @Output() close = new EventEmitter<any>();

  @Output() addTab = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousewheel', ['$event'])
  scroll(event: WheelEvent) {
    this.element.scrollLeft += event.wheelDeltaY;
  }

  selectOrCloseItem(event: MouseEvent, item: any) {
    if (event.button === 1) {
      this.closeItem(item);
    } else {
      this.select.next(item);
    }
  }

  closeItem(item: any) {
    this.close.next(item);
  }

  addNewTab() {
    this.addTab.next(null);
  }

  get element() {
    return this.elementRef.nativeElement as HTMLElement;
  }

}
