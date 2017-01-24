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

  itemSize = 34;

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

  itemsPerPage = 0;

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

  updateCollection(forceUpdate = false) {
    if (!this.originalItems) {
      return;
    }

    this.element = this.templateRef.elementRef.nativeElement.nextSibling;

    let itemsCount = this.originalItems.length;
    let height = this.container.clientHeight;
    let scroll = this.container.scrollTop;

    if (height === 0) {
      height = this.itemSize * itemsCount;
    }

    this.itemsPerPage = Math.ceil(height / this.itemSize);

    this.minIndex = Math.floor(scroll / this.itemSize);
    this.maxIndex = this.minIndex + this.itemsPerPage;

    let shouldUpdate = (
      this.minIndex < this.minBufferedIndex ||
      this.maxIndex > this.maxBufferedIndex
    );

    if (this._slicedItems && (shouldUpdate || forceUpdate)) {
      this.minBufferedIndex = Math.max(0, this.minIndex - this.BUFFER);
      this.maxBufferedIndex = Math.min(itemsCount, this.maxIndex + this.BUFFER);

      let slicedItems = this.originalItems.slice(
        this.minBufferedIndex,
        this.maxBufferedIndex,
      );

      this._slicedItems.next(slicedItems);

      this.element.style.paddingTop = (
        `${(this.minBufferedIndex) * this.itemSize}px`
      );
      this.element.style.paddingBottom = (
        `${(itemsCount - this.maxBufferedIndex) * this.itemSize}px`
      );
    }
  }

  @Input()
  set virtualForOf(items: any[]) {
    this.originalItems = items;
    if (this.container) {
      this.updateCollection(true);
    }
  }

  scrollTo(index: number) {
    if (index === 0) {
      this.container.scrollTop = 0;
    } else if (index < this.minIndex) {
      this.container.scrollTop -= (this.minIndex - index) * this.itemSize;
    } else if (index >= this.maxIndex - 1) {
      this.container.scrollTop += (index - this.maxIndex + 2) * this.itemSize;
    }
  }

}
