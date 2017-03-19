export * from './tray.service';

import { NgModule } from '@angular/core';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { TrayService } from './tray.service';

@Plugin()
@NgModule({
  imports: [],
  providers: [TrayService],
})
class Module { }
