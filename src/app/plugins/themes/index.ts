import { NgModule } from '@angular/core';

import { MODULES } from 'app/plugging';
import { Commands } from './commands';
import { CoreModule } from 'app/core.module';

@NgModule({
  imports: [CoreModule],
  providers: [Commands],
})
class ThemesModule { }

MODULES.push(ThemesModule);
