import { Command } from 'core/commands';

export class CoreCommands {

  @Command({isVisibleInPallete: false})
  blur() {
    let element = document.activeElement as HTMLElement;
    element.blur();
  }

}
