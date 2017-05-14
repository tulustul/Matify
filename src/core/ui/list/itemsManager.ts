import { Subject } from 'rxjs/Subject';

import { filter } from 'core/filters';
import { Column } from './column.interface';

type SortOrder = 'asc' | 'desc';

export class ItemsManager {

  private _items$ = new Subject<any[]>();
  items$ = this._items$.asObservable();
  _items: any[] = [];

  private _filteredItems$ = new Subject<any[]>();
  filteredItems$ = this._filteredItems$.asObservable();
  filteredItems: any[] = [];

  searchTerm: string;

  searchBy: string[] = [];

  sortedBy: Column<any>;

  sortOrder: SortOrder;

  get items() {
    return this._items;
  }
  set items(items: any[]) {
    this._items = items;
    this.search(this.searchTerm);
  }

  delete(items: any[]) {
    this.items = this.items.filter(i => items.indexOf(i) === -1);
    this._items$.next(this.items);
  }

  search(term: string) {
    this.searchTerm = term;
    if (this.searchTerm) {
      this.filteredItems = filter(
        term, this.items, this.searchBy,
      );
    } else {
      this.filteredItems = this.items;
    }
    this._filteredItems$.next(this.filteredItems);
  }

  sort(column: Column<any>) {
    if (this.sortedBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedBy = column;
      this.sortOrder = 'asc';
    }

    const sortFactor = this.sortOrder === 'asc' ? 1 : -1;

    this.items = this.items.sort((a, b) => {
      a = column.sortGetter(a);
      b = column.sortGetter(b);
      return a > b ? sortFactor : -sortFactor;
    });
    this._items$.next(this.items);
  }

  move(items: any[], by: number) {
    items = items.sort((a, b) => {
      return (this.items.indexOf(b) - this.items.indexOf(a)) * by;
    })

    const firstItemIndex = this.items.indexOf(items[0]);
    const lastItemIndex = this.items.indexOf(items[items.length - 1]);

    if (by < 0 && firstItemIndex === 0) {
      return;
    }

    if (by > 0 && lastItemIndex === this.items.length - 1) {
      return;
    }

    for (const item of items) {
      const index = this.items.indexOf(item);
      if (index !== -1) {
        let newIndex = Math.max(0, Math.min(
          this.items.length - 1, index + by,
        ));
        this.items.splice(newIndex, 0, this.items.splice(index, 1)[0]);
      }
    }

    this._items$.next(this.items);
  }

}
