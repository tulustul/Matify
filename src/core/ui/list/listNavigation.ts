import { Subject } from 'rxjs/Subject';

import { ItemsManager } from './itemsManager';
import { IList } from './list.interface';

export class ListNavigation {

  private _focusedItem$ = new Subject<any[]>();
  focusedItem$ = this._focusedItem$.asObservable();
  focusedItem: any[] = [];

  private _selectedItems$ = new Subject<Set<any>>();
  selectedItems$ = this._selectedItems$.asObservable();
  selectedItems = new Set<any>();

  cursor = -1;

  constructor(private list: IList) {
    this.list.itemsManager.items$.subscribe(() => {
      if (this.items.length) {
        if (this.cursor !== -1) {
          this.cursor = Math.min(this.cursor, this.items.length);
          this.focus(this.items[this.cursor]);
        } else {
          this.cursor = 0;
          this.focus(this.items[this.cursor]);
        }
      } else {
        this.cursor = -1;
        this.focus(null);
      }
    });
  }

  setCursor(cursor: number) {
    this.cursor = Math.min(cursor, this.items.length - 1);
  }

  reset() {
    this.cursor = -1;
    this.focus(null);
    this.clearSelection();
  }

  clearSelection() {
    this.selectedItems.clear();
    this._selectedItems$.next(this.selectedItems);
  }

  addToSelection(item: any) {
    this.selectedItems.add(this.focusedItem);this._selectedItems$.next(this.selectedItems);
  }

  addRangeToSelection(from: number, to: number) {
    for (let item of this.items.slice(from, to + 1)) {
      if (this.selectedItems.has(item)) {
        // this.selectedItems.delete(item);
      } else {
        this.selectedItems.add(item);
      }
    }
    this.addToSelection(this.focusedItem);
  }

  focus(item: any) {
    this.focusedItem = item;
    this._focusedItem$.next(item);
  }

  next(addToSelection = false) {
    this.step(1, addToSelection);
  }

  previous(addToSelection = false) {
    this.step(-1, addToSelection);
  }

  nextPage(addToSelection = false) {
    this.step(this.list.itemsPerPage, addToSelection);
  }

  previousPage(addToSelection = false) {
    this.step(-this.list.itemsPerPage, addToSelection);
  }

  step(offset: number, addToSelection = false) {
    const oldCursor = this.cursor;

    this.cursor += offset;
    this.cursor = Math.max(
      0, Math.min(this.items.length - 1, this.cursor)
    );
    this.focus(this.items[this.cursor]);

    if (addToSelection) {
      const from = Math.min(oldCursor, this.cursor);
      const to = Math.max(oldCursor, this.cursor);
      this.addRangeToSelection(from, to);
    } else {
      this.clearSelection();
    }
  }

  get items() {
    return this.list.itemsManager.items;
  }

  get selection() {
    if (this.selectedItems.size > 0) {
      return Array.from(this.selectedItems);
    } else if (this.focusedItem) {
      return [this.focusedItem];
    } else {
      return [];
    }
  }

}
