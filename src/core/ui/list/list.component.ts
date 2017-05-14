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
import { ItemsManager } from './itemsManager';
import { ListNavigation } from './listNavigation';
import { IList } from './list.interface';

@Component({
  selector: 'mp-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements IList {

  private _itemSize = 34;

  private _columns: Column<any>[];

  itemsManager = new ItemsManager();

  navigation = new ListNavigation(this);

  @Input()
  id: string;

  @Input()
  headerEnabled = true;

  @Input()
  markedItem: any;

  @Input()
  noItemsMessage: string;

  @Input()
  searchBy: string[] = [];

  @Output()
  select = new EventEmitter<any>();

  @Output()
  highlight = new EventEmitter<any>();

  @Output()
  change = new EventEmitter<any[]>();

  @Output()
  endReached = new EventEmitter<void>();

  @ViewChild(VirtualRepeaterDirective)
  repeater: VirtualRepeaterDirective;

  @ContentChild(TemplateRef)
  template: TemplateRef<any>;

  @Input()
  itemsEqualityFn = (itemA: any, itemB: any) => itemA === itemB;

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.repeater.endReached.subscribe(
      () => this.endReached.next(null),
    );

    this.itemsManager.searchBy = this.searchBy;
    this.itemsManager.items$.subscribe(items => {
      this.change.next(items);
    });

    this.navigation.focusedItem$.subscribe(item => {
      if (item) {
        this.scrollViewToItem(item);
      } else {
        this.scrollToTop();
      }
      this.highlight.next(item);
      this.cdr.markForCheck();
    });
  }

  @Input()
  set items(items: any[]) {
    this.itemsManager.items = items;
  }
  get items() {
    return this.itemsManager.items;
  }

  @Input()
  set itemSize(size: number) {
    this.repeater.itemSize = size;
  }

  @Input()
  set columns(columns: Column<any>[]) {
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

  scrollViewToItem(item: any) {
    let index = this.items.indexOf(item);
    if (index !== -1) {
      this.repeater.scrollTo(index);
    }
  }

  scrollToTop() {
    this.repeater.scrollTo(0);
  }

  focus() {
    this.listService.focus(this);
  }

  blur() {
    this.listService.blur();
  }

  selectSingleItem(item: any, event: MouseEvent = null) {
    this.navigation.focus(item);
    this.navigation.clearSelection();
    this.navigation.addToSelection(item);
    this.emitFocusedItem();
  }

  emitFocusedItem() {
    this.navigation.clearSelection();
    this.select.next(this.navigation.focusedItem);
  }

  get sortIcon() {
    return (
      this.itemsManager.sortOrder === 'asc'
      ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
    );
  }

  get itemsPerPage() {
    return this.repeater.itemsPerPage;
  }

}
