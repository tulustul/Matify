import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Settings } from './settings.service';
import { Keybindings } from './keybindings.service';
import { CommandRunner } from './commands';
import { CoreModule } from './core.module';

import { MODULES } from './plugging';

import { LibraryComponent } from 'app/plugins/library/library.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ...MODULES
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
