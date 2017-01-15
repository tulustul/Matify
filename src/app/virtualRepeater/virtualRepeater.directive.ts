import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  EmbeddedViewRef,
  Input,
} from '@angular/core';

import { Observable, Observer } from 'rxjs';

@Directive({
  selector: '[virtualFor][virtualForOf]',
})
export class VirtualRepeater {

  BUFFER = 5;

  view: EmbeddedViewRef<any>;

  originalItems: any[];

  slicedItems: Observable<any>;
  _slicedItems: Observer<any>;

  container: HTMLElement;

  element: HTMLElement;

  minIndex = 0;
  maxIndex = 0;

  constructor(
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) {
    this.slicedItems = Observable.create(observer => {
      this._slicedItems = observer;
    });
  }

  ngOnInit() {
    this.container = this.elementRef.nativeElement.parentElement;

    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

    this.view.context.$implicit = this.slicedItems;

    this.container.addEventListener('scroll', () => {
      this.updateCollection();
    });

    this.updateCollection();
  }

  updateCollection() {
    if (!this.originalItems) {
      return;
    }

    this.element = this.templateRef.elementRef.nativeElement.nextSibling;

    let itemsCount = this.originalItems.length;
    let itemSize = 34;
    let height = this.container.clientHeight;
    let scroll = this.container.scrollTop;

    let itemsPerPage = Math.ceil(height / itemSize);

    let minVisibleIndex = Math.floor(scroll / itemSize);
    let maxVisibleIndex = minVisibleIndex + itemsPerPage;

    if (minVisibleIndex < this.minIndex || maxVisibleIndex > this.maxIndex) {
      this.minIndex = Math.max(0, minVisibleIndex - this.BUFFER);
      this.maxIndex = Math.min(itemsCount, maxVisibleIndex + this.BUFFER);

      let slicedItems = this.originalItems.slice(this.minIndex, this.maxIndex);

      this._slicedItems.next(slicedItems);

      this.element.style.paddingTop = (
        `${(this.minIndex) * itemSize}px`
      );
      this.element.style.paddingBottom = (
        `${(itemsCount - this.maxIndex) * itemSize}px`
      );
    }
  }

  @Input()
  set virtualForOf(items: any[]) {
    this.originalItems = items;
    this.updateCollection();
  }

}
