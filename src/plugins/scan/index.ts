import { NgModule } from '@angular/core';

import { Scan } from './scan';

import { MODULES } from 'core/plugging';

import { NotificationsModule } from 'plugins/notifications';

@NgModule({
  imports: [NotificationsModule],
  providers: [Scan],
})
export class PaletteModule { }

MODULES.push(PaletteModule);
