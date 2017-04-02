import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { ShortcutsViewComponent } from './shortcuts.component';
import { ShortcutsCommands } from './commands';

@Plugin()
@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [ShortcutsViewComponent],
  entryComponents: [ShortcutsViewComponent],
  providers: [ShortcutsCommands],
})
class Module { }
