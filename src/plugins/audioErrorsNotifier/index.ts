export * from './audioErrorsNotifier.service';

import { NgModule } from '@angular/core';

import { AudioErrorsNotifier } from './audioErrorsNotifier.service';
import { MODULES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

@NgModule({
  imports: [CoreModule],
  providers: [AudioErrorsNotifier],
})
class AudioErrorsNotifierModule { }

MODULES.push(AudioErrorsNotifierModule);
