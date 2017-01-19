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

  ITEM_SIZE = 34;

  view: EmbeddedViewRef<any>;

  originalItems: any[];

  slicedItems: Observable<any>;
  _slicedItems: Observer<any>;

  container: HTMLElement;

  element: HTMLElement;

  minIndex = 0;
  maxIndex = 0;

  minBufferedIndex = 0;
  maxBufferedIndex = 0;

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
    let height = this.container.clientHeight;
    let scroll = this.container.scrollTop;

    let itemsPerPage = Math.ceil(height / this.ITEM_SIZE);

    this.minIndex = Math.floor(scroll / this.ITEM_SIZE);
    this.maxIndex = this.minIndex + itemsPerPage;

    if (
      this.minIndex < this.minBufferedIndex ||
      this.maxIndex > this.maxBufferedIndex
    ) {
      this.minBufferedIndex = Math.max(0, this.minIndex - this.BUFFER);
      this.maxBufferedIndex = Math.min(itemsCount, this.maxIndex + this.BUFFER);

      let slicedItems = this.originalItems.slice(
        this.minBufferedIndex,
        this.maxBufferedIndex,
      );

      this._slicedItems.next(slicedItems);

      this.element.style.paddingTop = (
        `${(this.minBufferedIndex) * this.ITEM_SIZE}px`
      );
      this.element.style.paddingBottom = (
        `${(itemsCount - this.maxBufferedIndex) * this.ITEM_SIZE}px`
      );
    }
  }

  @Input()
  set virtualForOf(items: any[]) {
    this.originalItems = items;
    this.updateCollection();
  }

  scrollTo(index: number) {
    if (index < this.minIndex) {
      this.container.scrollTop -= (this.minIndex - index) * this.ITEM_SIZE;
    } else if (index >= this.maxIndex - 1) {
      this.container.scrollTop += (index - this.maxIndex + 2) * this.ITEM_SIZE;
    }
  }

}
