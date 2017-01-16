import { Injectable } from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';

type PaletteListener = (item: any) => void;

@Injectable()
export class PaletteService {

  private _items$ = new ReplaySubject<any[]>(1);
  items$ = this._items$.asObservable();

  preview$ = new Subject<any>();
  selection$ = new Subject<any>();

  fields: string[];

  onSelect: PaletteListener;
  onPreview: PaletteListener;

  constructor() {
    this.preview$.subscribe(item => {
      if (this.onPreview) {
        this.onPreview(item);
      }
    });

    this.selection$.subscribe(item => {
      if (this.onSelect) {
        this.onSelect(item);
      }
    });
  }

  openPalette(
    items: any[],
    fields: string[],
    onSelect: PaletteListener,
    onPreview: PaletteListener = null,
  ) {
    this.onSelect = onSelect;
    this.onPreview = onPreview
    this.fields = fields;

    this._items$.next(items);
  }

  closePalette() {
    this.onSelect = null;
    this.onPreview = null;
  }

}
