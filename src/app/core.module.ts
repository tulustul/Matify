import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Settings } from 'app/settings.service';
import { Keybindings } from 'app/keybindings.service';
import { CommandRunner } from 'app/commands/runner';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
  ],
  providers: [
    Settings,
    Keybindings,
    CommandRunner,
  ],
})
export class CoreModule { }
