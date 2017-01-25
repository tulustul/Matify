import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MODULES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { PlaylistModule } from 'plugins/playlist';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlaylistModule,
    CoreModule,
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
  entryComponents: [SearchComponent],
  providers: [SearchService],
})
export class SearchModule { }

MODULES.push(SearchModule);
