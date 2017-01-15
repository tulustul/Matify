import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Settings } from 'app/settings.service';
import { Keybindings } from 'app/keybindings.service';
import { CommandRunner } from 'app/commands/runner';
import { AudioService } from './audio.service';
import { VirtualRepeater } from './virtualRepeater';
import { BackgroundSliderComponent } from './backgroundSlider';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
  ],
  declarations: [
    VirtualRepeater,
    BackgroundSliderComponent,
  ],
  providers: [
    Settings,
    Keybindings,
    CommandRunner,
    AudioService,
  ],
  exports: [
    VirtualRepeater,
    BackgroundSliderComponent,
  ],
})
export class CoreModule { }
