import { NgModule } from '@angular/core';

import { Scan } from './scan';
import { NotificationsModule } from 'app/plugins/notifications';

@NgModule({
  imports: [NotificationsModule],
  providers: [Scan],
})
export class PaletteModule { }
