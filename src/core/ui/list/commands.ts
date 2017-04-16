import { Injectable } from '@angular/core';

import { Command } from 'core/commands';

import { ListService } from './';

@Injectable()
export class ListCommands {

  constructor(private listService: ListService) {}

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.down',
  })
  listDown() {
    this.listService.focusedList.next();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.up',
  })
  listUp() {
    this.listService.focusedList.previous();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.pageDown',
  })
  listPageDown() {
    this.listService.focusedList.nextPage();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.pageUp',
  })
  listPageUp() {
    this.listService.focusedList.previousPage();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addToSelectionDown',
  })
  listAddToSelectionDown() {
    this.listService.focusedList.next(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addToSelectionUp',
  })
  listAddToSelectionUp() {
    this.listService.focusedList.previous(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addPageToSelectionDown',
  })
  listAddPageToSelectionDown() {
    this.listService.focusedList.nextPage(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addPageToSelectionUp',
  })
  listAddPageToSelectionUp() {
    this.listService.focusedList.previousPage(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.selectItem',
  })
  listSelectItem() {
    this.listService.focusedList.selectCursorItem();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.deleteItem',
  })
  listDeleteItem() {
    this.listService.focusedList.emitDelete();
  }

}
