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

import { VirtualRepeaterDirective } from 'core/ui/virtualRepeater';

import { ListService } from './list.service';
import { Column } from './column.interface';

@Component({
  selector: 'mp-list',
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

  @Output()
  select = new EventEmitter<any>();

  @Output()
  highlight = new EventEmitter<any>();

  @Output()
  delete = new EventEmitter<any>();

  @Output()
  endReached = new EventEmitter<void>();

  @ViewChild(VirtualRepeaterDirective)
  repeater: VirtualRepeaterDirective;

  @ContentChild(TemplateRef)
  template: TemplateRef<any>;

  cursor = -1;

  cursorItem: any;

  selectedItems = new Set<any>();

  @Input()
  itemsEqualityFn = (itemA: any, itemB: any) => itemA === itemB;

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.repeater.endReached.subscribe(
      () => this.endReached.next(null)
    );
  }

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

  setCursorItem(item: any) {
    this.cursorItem = item;
    this.highlight.next(item);
  }

  scrollViewToItem(item: any) {
    let index = this.items.indexOf(item);
    if (index !== -1) {
      this.repeater.scrollTo(index);
    }
  }

  reset() {
    this.cursor = -1;
    this.cursorItem = null;
    this.selectedItems.clear();
    this.scrollToTop();
  }

  scrollToTop() {
    this.repeater.scrollTo(0);
  }

  selectCursorItem() {
    this.selectItem(this.cursorItem);
  }

  focus() {
    this.listService.focus(this);
  }

  blur() {
    this.listService.blur();
  }

  next(addToSelection = false) {
    this.step(1, addToSelection);
  }

  previous(addToSelection = false) {
    this.step(-1, addToSelection);
  }

  nextPage(addToSelection = false) {
    this.step(this.repeater.itemsPerPage, addToSelection);
  }

  previousPage(addToSelection = false) {
    this.step(-this.repeater.itemsPerPage, addToSelection);
  }

  step(offset: number, addToSelection = false) {
    const oldCursor = this.cursor;

    this.cursor += offset;
    this.cursor = Math.max(
      0, Math.min(this.items.length - 1, this.cursor)
    );
    this.setCursorItem(this.items[this.cursor]);
    this.scrollViewToItem(this.cursorItem);

    if (addToSelection) {
      let start = Math.min(oldCursor, this.cursor);
      const end = Math.max(oldCursor, this.cursor);
      if (this.selectedItems.size) {
        start++;
      }
      console.log(start, end);
      for (let item of this.items.slice(start, end)) {
        if (this.selectedItems.has(item)) {
          this.selectedItems.delete(item);
        } else {
          this.selectedItems.add(item);
        }
      }
      this.selectedItems.add(this.cursorItem);
    } else {
      this.selectedItems.clear();
    }
    this.cdr.markForCheck();
  }

  emitDelete() {
    this.delete.next(this.cursorItem);
  }

  @Input()
  set items(items: any[]) {
    this._items = items;
    if (this.items.length) {
      if (this.cursor !== -1) {
        this.cursor = Math.min(this.cursor, this.items.length);
        this.cursorItem = this.items[this.cursor];
      } else {
        this.cursor = 0;
        this.setCursorItem(this.items[this.cursor]);
      }
    } else {
      this.cursor = -1;
      this.cursorItem = null;
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
