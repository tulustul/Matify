import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { CommandRunner } from 'core/commands';
import { ContextMenu, ContextMenuItem } from './contextMenu.interface';

@Injectable()
export class ContextMenuService {

  private menu: ContextMenu;
  private _menu$ = new Subject<ContextMenu>();
  public menu$ = this._menu$.asObservable();

  public top: number;
  public bottom: number;
  public left: number;

  constructor(private commandRunner: CommandRunner) {
    Observable.fromEvent(
      window, 'click',
    ).subscribe((event: MouseEvent) => {
      if (this.menu) {
        if (!event.srcElement.closest('mp-context-menu')) {
          this.hideMenu();
        }
      }
    });
  }

  public showMenuForElement(el: HTMLElement, menu: ContextMenu) {
    this.calculatePositionForElement(el);
    this.menu = menu;
    this._menu$.next(menu);
  }

  public hideMenu() {
    this.menu = null;
    this._menu$.next(null);
  }

  private calculatePositionForElement(el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    if (rect.top > window.innerHeight / 2) {
      this.bottom = window.innerHeight - rect.top;
      this.top = null;
    } else {
      this.bottom = null;
      this.top = rect.bottom;
    }
    this.left = rect.right - rect.width / 2 - 100;
  }

  triggerAction(item: ContextMenuItem) {
    this.hideMenu();
    this.commandRunner.runCommandByName(item.command, ...item.commandArgs);
  }

}
