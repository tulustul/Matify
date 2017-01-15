import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  EmbeddedViewRef,
  Input,
} from '@angular/core';

@Directive({
  selector: '[virtualFor][virtualForOf]',
})
export class VirtualRepeater {

  view: EmbeddedViewRef<any>;

  originalItems: any[];

  container: HTMLElement;

  element: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) {
  }

  ngOnInit() {
    this.container = this.elementRef.nativeElement.parentElement;

    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

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
    let itemSize = 29;
    let height = this.container.clientHeight;
    let scroll = this.container.scrollTop;

    let itemsPerPage = Math.ceil(height / itemSize);
    let index = Math.floor(scroll / itemSize);

    let slicedItems = this.originalItems.slice(index, index + itemsPerPage);

    this.view.context.$implicit = slicedItems;
    this.element.style.paddingTop = `${index * itemSize}px`;
    this.element.style.paddingBottom = `${(itemsCount - itemsPerPage - index) * itemSize}px`;
  }

  @Input()
  set virtualForOf(items: any[]) {
    this.originalItems = items;
    this.updateCollection();
  }

}
