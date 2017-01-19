import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Settings } from './settings.service';
import { Theme } from './theme.service';
import { Keybindings } from './keybindings.service';
import { CommandRunner } from './commands/runner';
import { AudioService } from './audio.service';
import { VirtualRepeater } from './virtualRepeater';
import { BackgroundSliderComponent } from './backgroundSlider';
import { SidebarComponent } from './sidebar';
import { PaletteComponent, PaletteService } from './palette';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    VirtualRepeater,
    BackgroundSliderComponent,
    SidebarComponent,
    PaletteComponent,
  ],
  providers: [
    Settings,
    Theme,
    Keybindings,
    CommandRunner,
    AudioService,
    PaletteService,
  ],
  exports: [
    VirtualRepeater,
    BackgroundSliderComponent,
    SidebarComponent,
    PaletteComponent,
  ],
})
export class CoreModule { }
