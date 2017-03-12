import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ContentChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';

import * as jss from 'jss/jss';

import { VirtualRepeater } from 'core/virtualRepeater';

import { ListService } from './list.service';
import { Column } from './column.interface';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

  private _itemSize = 34;

  private _columns: Column[];

  private _items: any[];

  @Input()
  id: string;

  @Input()
  headerEnabled = true;

  @Input()
  markedItem: any;

  @Input()
  noItemsMessage: string;

  @Input()
  itemsEqualityFn = (itemA: any, itemB: any) => itemA === itemB;

  @Output()
  select = new EventEmitter<any>();

  @Output()
  highlight = new EventEmitter<any>();

  @Output()
  delete = new EventEmitter<any>();

  @ViewChild(VirtualRepeater)
  repeater: VirtualRepeater;

  @ContentChild(TemplateRef)
  template: TemplateRef<any>;

  currentIndex = -1;

  highlightedItem: any;

  selectedItem: any;

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  @Input()
  set columns(columns: Column[]) {
    this._columns = columns;
    let i = 1;
    for (let column of this.columns) {
      if (column.size) {
        jss.set(`#${this.id} .mp-cell:nth-child(${i})`, {
          width: column.size,
        });
      }
      i++;
    }
  }
  get columns() {
    return this._columns;
  }

  selectItem(item: any) {
    this.select.next(item);
  }

  highlightItem(item: any) {
    this.highlightedItem = item;
    this.highlight.next(item);
  }

  scrollViewToItem(item: any) {
    let index = this.items.indexOf(item);
    if (index !== -1) {
      this.repeater.scrollTo(index);
    }
  }

  reset() {
    this.currentIndex = -1;
    this.highlightedItem = null;
    this.scrollToTop();
  }

  scrollToTop() {
    this.repeater.scrollTo(0);
  }

  selectHighlightedItem() {
    this.selectItem(this.highlightedItem);
  }

  focus() {
    this.listService.focus(this);
  }

  blur() {
    this.listService.blur();
  }

  next() {
    this.step(1);
  }

  previous() {
    this.step(-1);
  }

  nextPage() {
    this.step(this.repeater.itemsPerPage);
  }

  previousPage() {
    this.step(-this.repeater.itemsPerPage);
  }

  step(offset: number) {
    this.currentIndex += offset;
    this.currentIndex = Math.max(
      0, Math.min(this.items.length - 1, this.currentIndex)
    );
    this.highlightItem(this.items[this.currentIndex]);
    this.scrollViewToItem(this.highlightedItem);
    this.cdr.markForCheck();
  }

  emitDelete() {
    this.delete.next(this.highlightedItem);
  }

  @Input()
  set items(items: any[]) {
    this._items = items;
    if (this.items.length) {
      if (this.currentIndex !== -1) {
        this.currentIndex = Math.min(this.currentIndex, this.items.length);
        this.highlightedItem = this.items[this.currentIndex];
      } else {
        this.currentIndex = 0;
        this.highlightItem(this.items[this.currentIndex]);
      }
    } else {
      this.currentIndex = -1;
      this.highlightedItem = null;
    }
  }
  get items() {
    return this._items;
  }

  @Input()
  set itemSize(size: number) {
    this.repeater.itemSize = size;
  }

  trackItem(index: number, item: any) {
    return item.id;
  }

}
