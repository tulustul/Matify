import { ListComponent } from './'

export class ListService {

  focusStack: ListComponent[] = [];

  focusedList: ListComponent;

  focus(list: ListComponent) {
    let index = this.focusStack.indexOf(list);
    if (index !== -1) {
      this.focusStack.splice(index, 1);
    }
    this.focusStack.push(list);
    this.focusedList = list;
  }

  blur() {
    this.focusStack.pop();
    this.focusedList = this.focusStack[this.focusStack.length - 1];
  }

}
