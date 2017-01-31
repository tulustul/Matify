export * from './tray.service';

import { NgModule } from '@angular/core';

import { MODULES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { TrayService } from './tray.service';

@NgModule({
  imports: [],
  providers: [TrayService],
})
class TrayModule { }

MODULES.push(TrayModule);
