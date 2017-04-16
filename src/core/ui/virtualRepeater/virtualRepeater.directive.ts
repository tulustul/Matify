import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  EmbeddedViewRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

import { ReplaySubject } from 'rxjs';

@Directive({
  selector: '[virtualFor][virtualForOf]',
})
export class VirtualRepeaterDirective implements OnInit {

  BUFFER = 5;

  itemSize = 34;

  view: EmbeddedViewRef<any>;

  originalItems: any[];

  private _slicedItems$ = new ReplaySubject<any>(1);
  slicedItems$ = this._slicedItems$.asObservable();

  container: HTMLElement;

  element: HTMLElement;

  minIndex = 0;
  maxIndex = 0;

  minBufferedIndex = 0;
  maxBufferedIndex = 0;

  itemsPerPage = 0;

  @Output()
  endReached = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) {}

  ngOnInit() {
    this.container = this.elementRef.nativeElement.parentElement;

    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

    this.view.context.$implicit = this.slicedItems$;

    this.container.addEventListener('scroll', e => {
      this.updateCollection();
      const el = e.target as HTMLElement;
      if (el.scrollTop === el.scrollHeight - el.offsetHeight) {
        this.endReached.next(null);
      }
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

    if (shouldUpdate || forceUpdate) {
      this.minBufferedIndex = Math.max(0, this.minIndex - this.BUFFER);
      this.maxBufferedIndex = Math.min(itemsCount, this.maxIndex + this.BUFFER);

      let slicedItems = this.originalItems.slice(
        this.minBufferedIndex,
        this.maxBufferedIndex,
      );

      this._slicedItems$.next(slicedItems);

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
