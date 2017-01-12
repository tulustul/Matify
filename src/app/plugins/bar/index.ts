import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES } from 'app/plugging';
import { BarComponent } from './bar.component';

@NgModule({
  declarations: [
    BarComponent,
  ],
  imports: [CommonModule],
  exports: [BarComponent],
})
class BarModule { }

MODULES.push(BarModule);
