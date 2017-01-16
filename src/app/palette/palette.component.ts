import {
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { ICommand } from 'app/commands';
import { PaletteService } from './palette.service';
import { Keybindings } from 'app/keybindings.service';

@Component({
  selector: 'palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class PaletteComponent {

  currentIndex = 0;

  searchTerm = '';

  opened = false;

  items: any[] = [];

  fields: string[] = [];

  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(
    private paletteService: PaletteService,
    keybindings: Keybindings,
  ) {
    this.paletteService.items$.subscribe(items => {
      this.items = items;
      this.opened = true;
      this.searchTerm = '';
      this.currentIndex = 0;
      this.fields = this.paletteService.fields;
      setTimeout(
        () => (this.searchBox.nativeElement as HTMLElement).focus(),
      );
    });

    keybindings.keys$.subscribe(combo => {
      if (!this.opened) {
        return;
      }
      if (combo === 'arrowdown') {
        this.next();
      } else if (combo === 'arrowup') {
        this.previous();
      } else if (combo === 'enter') {
        this.selectItem(this.currentIndex);
        this.opened = false;
      } else if (combo === 'escape') {
        this.opened = false;
      }
    })
  }

  filterItems() {
    this.currentIndex = 0;
    this.items = this.items.filter(item => {
      let term = this.searchTerm.toLowerCase();
      let itemName = item.displayName.toLowerCase();
      let i = 0;
      let ok = term.length === 0;
      for (let ch of term) {
        ok = false;
        while (i < itemName.length) {
          if (itemName[i] === ch) {
            ok = true;
            break;
          }
          i++;
        }
      }
      return ok;
    });
  }

  previewItem(index: number) {
    this.currentIndex = index;
    this.paletteService.preview$.next(this.items[index]);
  }

  selectItem(index: number) {
    this.paletteService.selection$.next(this.items[index]);
  }

  next() {
    this.step(1);
  }

  previous() {
    this.step(-1);
  }

  step(offset: number) {
    let newIndex = Math.max(
      0, Math.min(
        this.items.length - 1, this.currentIndex + offset
      )
    );
    this.previewItem(newIndex);
  }

}
