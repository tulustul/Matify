import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { ICommand } from 'core/commands';
import { Keybindings } from 'core/keybindings.service';
import { Column, ListComponent } from 'core/list';
import { FilterService } from 'core/filter.service';

import { PaletteService } from './palette.service';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteComponent {

  currentIndex = 0;

  searchTerm = '';

  opened = false;

  items: any[] = [];

  filteredItems: any[] = [];

  fields: string[] = [];

  columns: Column[] = [];

  @ViewChild('searchBox') searchBox: ElementRef;

  @ViewChild(ListComponent) list: ListComponent;

  constructor(
    private paletteService: PaletteService,
    private filterService: FilterService,
    changeDetectorRef: ChangeDetectorRef,
    keybindings: Keybindings,
  ) {
    this.paletteService.items$.subscribe(items => {
      this.items = items;
      this.filteredItems = this.items;
      this.opened = true;
      this.searchTerm = '';
      this.currentIndex = 0;
      this.fields = this.paletteService.fields;

      this.list.focus();

      this.columns = this.fields.map(f => {
        return {getter: item => item[f]};
      });

      changeDetectorRef.markForCheck();

      setTimeout(
        () => (this.searchBox.nativeElement as HTMLElement).focus(),
      );
    });

    keybindings.keys$.subscribe(combo => {
      if (!this.opened) {
        return;
      }
      if (combo === 'escape') {
        this.opened = false;
        this.list.reset();
        this.list.blur();
        changeDetectorRef.markForCheck();
      }
    })
  }

  filterItems() {
    this.currentIndex = 0;
    this.filteredItems = this.filterService.fuzzyFilter(
      this.searchTerm, this.items, this.fields[0],
    );
  }

  previewItem(item: any) {
    if (item) {
      this.paletteService.preview$.next(item);
    }
  }

  selectItem(item: any) {
    if (item) {
      this.paletteService.selection$.next(item);
    }
    this.opened = false;
    this.list.blur();
  }

}
