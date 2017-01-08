import { Component, ViewChild, ElementRef } from '@angular/core';

import { ICommand } from 'app/commands';
import { PaletteService } from './palette.service';
import { Keybindings } from 'app/keybindings.service';

@Component({
  selector: 'commands-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  host: {
    '[hidden]': '!opened',
  },
})
export class PaletteComponent {

  commands: ICommand[];

  currentIndex = 0;

  searchTerm = '';

  opened = false;

  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(
    private paletteService: PaletteService,
    keybindings: Keybindings,
  ) {
    this.commands = this.paletteService.commands;

    this.paletteService.state$.subscribe(opened => {
      this.opened = opened;
      if (this.opened) {
        this.searchTerm = '';
        this.commands = this.paletteService.commands;
        this.currentIndex = 0;
        setTimeout(
          () => (this.searchBox.nativeElement as HTMLElement).focus(),
        );
      }
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
        this.paletteService.runCommand(this.commands[this.currentIndex]);
      } else if (combo === 'escape') {
        this.opened = false;
      }
    })
  }

  filterCommands() {
    this.currentIndex = 0;
    this.commands = this.paletteService.commands.filter(command => {
      let term = this.searchTerm.toLowerCase();
      let commandName = command.displayName.toLowerCase();
      let i = 0;
      let ok = term.length === 0;
      for (let ch of term) {
        ok = false;
        while (i < commandName.length) {
          if (commandName[i] === ch) {
            ok = true;
            break;
          }
          i++;
        }
      }
      return ok;
    });
  }

  selectCommand(index: number) {
    this.currentIndex = index;
  }

  next() {
    this.step(1);
  }

  previous() {
    this.step(-1);
  }

  step(offset: number) {
    this.currentIndex = Math.max(
      0, Math.min(
        this.commands.length - 1, this.currentIndex + offset
      )
    );
  }

}
