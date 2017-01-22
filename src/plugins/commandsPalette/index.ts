import { NgModule } from '@angular/core';

import { MODULES } from 'core/plugging';
import { CoreModule } from 'core/core.module';
import { Commands } from './commands';

@NgModule({
  imports: [CoreModule],
  providers: [Commands],
})
export class CommandPaletteModule { }

MODULES.push(CommandPaletteModule);
