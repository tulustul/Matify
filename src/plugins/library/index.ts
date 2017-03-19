import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { LibraryComponent } from './library.component';

@Plugin({menuItems: [{
  icon: 'library_music',
  name: 'Library',
  component: LibraryComponent,
}]})
@NgModule({
  imports: [CommonModule],
  declarations: [LibraryComponent],
  exports: [LibraryComponent],
  entryComponents: [LibraryComponent],
})
export class Module { }
