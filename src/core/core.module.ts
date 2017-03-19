import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Settings } from './settings.service';
import { Theme } from './theme.service';
import { Keybindings } from './keybindings.service';
import { CommandRunner, CoreCommands } from './commands';
import { AudioService } from './audio.service';
import { AudioAnalyserService } from './audioAnalyser.service';
import { FilterService } from './filter.service';
import { ProxyServerService } from './proxyServer.service';
import { TracksService } from './tracks';

import { BackgroundSliderComponent } from './ui/backgroundSlider';
import { SidebarComponent } from './ui/sidebar';
import { PaletteComponent, PaletteService } from './ui/palette';
import { ModalsService, ModalComponent } from './ui/modals';
import { ListComponent, ListService, ListCommands } from './ui/list';
import { VirtualRepeaterDirective } from './ui/virtualRepeater';
import {
  NotificationsComponent,
  NotificationsService,
} from './ui/notifications';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    VirtualRepeaterDirective,
    BackgroundSliderComponent,
    SidebarComponent,
    PaletteComponent,
    ModalComponent,
    NotificationsComponent,
    ListComponent,
  ],
  providers: [
    Settings,
    Theme,
    Keybindings,
    CommandRunner,
    AudioService,
    AudioAnalyserService,
    PaletteService,
    TracksService,
    ModalsService,
    NotificationsService,
    CoreCommands,
    ListService,
    ListCommands,
    FilterService,
    ProxyServerService,
  ],
  exports: [
    VirtualRepeaterDirective,
    BackgroundSliderComponent,
    SidebarComponent,
    PaletteComponent,
    ModalComponent,
    NotificationsComponent,
    ListComponent,
  ],
})
export class CoreModule { }
