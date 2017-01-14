import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES } from 'app/plugging';
import { BarComponent } from './bar.component';
import { Commands } from './commands';

@NgModule({
  declarations: [
    BarComponent,
  ],
  imports: [CommonModule],
  exports: [BarComponent],
  providers: [Commands],
})
class BarModule { }

MODULES.push(BarModule);
