export * from './audioErrorsNotifier.service';

import { NgModule } from '@angular/core';

import { AudioErrorsNotifier } from './audioErrorsNotifier.service';
import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

@Plugin()
@NgModule({
  imports: [CoreModule],
  providers: [AudioErrorsNotifier],
})
class Module { }
