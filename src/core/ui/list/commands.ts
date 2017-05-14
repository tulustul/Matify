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
    this.list.navigation.next();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.up',
  })
  listUp() {
    this.list.navigation.previous();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.pageDown',
  })
  listPageDown() {
    this.list.navigation.nextPage();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.pageUp',
  })
  listPageUp() {
    this.list.navigation.previousPage();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addToSelectionDown',
  })
  listAddToSelectionDown() {
    this.list.navigation.next(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addToSelectionUp',
  })
  listAddToSelectionUp() {
    this.list.navigation.previous(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addPageToSelectionDown',
  })
  listAddPageToSelectionDown() {
    this.list.navigation.nextPage(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.addPageToSelectionUp',
  })
  listAddPageToSelectionUp() {
    this.list.navigation.previousPage(true);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.selectItem',
  })
  listSelectItem() {
    this.list.emitFocusedItem();
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.deleteItem',
  })
  listDeleteItem() {
    this.list.itemsManager.delete(this.list.navigation.selection);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.moveItemUp',
  })
  listMoveItemUp() {
    this.list.navigation.setCursor(this.list.navigation.cursor - 1);
    this.list.itemsManager.move(this.list.navigation.selection, -1);
  }

  @Command({
    isVisibleInPallete: false,
    name: 'navigation.moveItemDown',
  })
  listMoveItemDown() {
    this.list.navigation.setCursor(this.list.navigation.cursor + 1);
    this.list.itemsManager.move(this.list.navigation.selection, 1);
  }

  get list() {
    return this.listService.focusedList;
  }

}
