import { Injectable } from '@angular/core';

import { Command } from 'core/commands';

import { ListService } from './';

@Injectable()
export class ListCommands {

  constructor(private listService: ListService) {}

  @Command({isVisibleInPallete: false})
  listDown() {
    this.listService.focusedList.next();
  }

  @Command({isVisibleInPallete: false})
  listUp() {
    this.listService.focusedList.previous();
  }

  @Command({isVisibleInPallete: false})
  listPageDown() {
    this.listService.focusedList.nextPage();
  }

  @Command({isVisibleInPallete: false})
  listPageUp() {
    this.listService.focusedList.previousPage();
  }

  @Command({isVisibleInPallete: false})
  listAddToSelectionDown() {
    this.listService.focusedList.next(true);
  }

  @Command({isVisibleInPallete: false})
  listAddToSelectionUp() {
    this.listService.focusedList.previous(true);
  }

  @Command({isVisibleInPallete: false})
  listAddPageToSelectionDown() {
    this.listService.focusedList.nextPage(true);
  }

  @Command({isVisibleInPallete: false})
  listAddPageToSelectionUp() {
    this.listService.focusedList.previousPage(true);
  }

  @Command({isVisibleInPallete: false})
  listSelectItem() {
    this.listService.focusedList.selectCursorItem();
  }

  @Command({isVisibleInPallete: false})
  listDeleteItem() {
    this.listService.focusedList.emitDelete();
  }

}
