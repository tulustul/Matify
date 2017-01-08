import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaletteComponent } from './palette.component';
import { PaletteService } from './palette.service';
import { Commands } from './commands';
import { CoreModule } from 'app/core.module';

@NgModule({
  declarations: [
    PaletteComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [PaletteComponent],
  providers: [Commands, PaletteService],
})
export class PaletteModule { }
