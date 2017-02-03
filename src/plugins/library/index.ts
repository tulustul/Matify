import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES, PAGES } from 'core/plugging';
import { LibraryComponent } from './library.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LibraryComponent],
  exports: [LibraryComponent],
  entryComponents: [LibraryComponent],
})
export class LibraryModule { }

MODULES.push(LibraryModule);
PAGES.push({
  icon: 'library_music',
  name: 'Library',
  component: LibraryComponent,
});
