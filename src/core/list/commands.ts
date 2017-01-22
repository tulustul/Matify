import { Injectable } from '@angular/core';

import { Command } from 'core/commands';

import { ListService } from './';

@Injectable()
export class ListCommands {

  constructor(private listService: ListService) {}

  @Command({isVisibleInPallete: false})
  navigateListDown() {
    this.listService.focusedList.next();
  }

  @Command({isVisibleInPallete: false})
  navigateListUp() {
    this.listService.focusedList.previous();
  }

  @Command({isVisibleInPallete: false})
  navigateListPageDown() {
    this.listService.focusedList.nextPage();
  }

  @Command({isVisibleInPallete: false})
  navigateListPageUp() {
    this.listService.focusedList.previousPage();
  }

  @Command({isVisibleInPallete: false})
  listSelectItem() {
    this.listService.focusedList.selectHighlightedItem();
  }

}
