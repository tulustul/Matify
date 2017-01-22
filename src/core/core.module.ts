import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Settings } from './settings.service';
import { Theme } from './theme.service';
import { Keybindings } from './keybindings.service';
import { CommandRunner, CoreCommands } from './commands';
import { AudioService } from './audio.service';
import { VirtualRepeater } from './virtualRepeater';
import { BackgroundSliderComponent } from './backgroundSlider';
import { SidebarComponent } from './sidebar';
import { PaletteComponent, PaletteService } from './palette';
import { TracksService } from './tracks';
import { ModalsService, ModalComponent } from './modals';
import {
  NotificationsComponent,
  NotificationsService,
} from './notifications';

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
    ModalComponent,
    NotificationsComponent,
  ],
  providers: [
    Settings,
    Theme,
    Keybindings,
    CommandRunner,
    AudioService,
    PaletteService,
    TracksService,
    ModalsService,
    NotificationsService,
    CoreCommands,
  ],
  exports: [
    VirtualRepeater,
    BackgroundSliderComponent,
    SidebarComponent,
    PaletteComponent,
    ModalComponent,
    NotificationsComponent,
  ],
})
export class CoreModule { }
