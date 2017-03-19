import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { Commands } from './commands';

@Plugin()
@NgModule({
  imports: [CoreModule],
  providers: [Commands],
})
class Module { }
