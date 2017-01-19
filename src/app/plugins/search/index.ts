import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MODULES } from 'app/plugging';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SearchComponent],
  exports: [SearchComponent],
  entryComponents: [SearchComponent],
})
export class SearchModule { }

MODULES.push(SearchModule);
