import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { PaneView, View} from 'core/ui/pane';
import { Keybindings} from 'core/keybindings.service';

interface Section {
  name: string;
  bindings: Binding[];
}

interface Binding {
  binding: string;
  command: string;
  description: string;
}

@View
@Component({
  selector: 'mp-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutsViewComponent implements PaneView {

  key: string;

  displayName = 'Shortcuts';

  sections: Section[] = [];

  constructor(keybindings: Keybindings) {
    const sections = new Map<string, Section>();
    keybindings.bindings.forEach((value, key) => {
      const tokens = value.command.name.split('.');
      let sectionName;

      if (tokens.length === 1) {
        sectionName = 'Others';
      } else {
        sectionName = tokens[0];
      }

      let section = sections.get(sectionName);
      if (!section) {
        section = {name: sectionName, bindings: []};
        sections.set(section.name, section);
        this.sections.push(section);
      }

      section.bindings.push({
        binding: key,
        command: value.command.name,
        description: value.command.displayName,
      });
    });
  }

}
