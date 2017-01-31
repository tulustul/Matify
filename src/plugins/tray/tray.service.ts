import * as path from 'path';

import { Injectable } from '@angular/core';

import { AudioService } from 'core/audio.service';
import { PlaylistCommands } from 'plugins/playlist';

const {Tray, Menu, app} = require('electron').remote;

@Injectable()
export class TrayService {

  tray: any;

  constructor(
    private playlistCommands: PlaylistCommands,
    private audio: AudioService,
  ) {
    this.createTray();
  }

  createTray() {
    this.tray = new Tray('src/assets/tray.png');

    var contextMenu = Menu.buildFromTemplate([
      {
        label: 'Pause',
        click: () => this.audio.togglePause(),
      }, {
        type: 'separator'
      }, {
        label: 'Previous',
        click: () => this.playlistCommands.skipTrackBy(-1),
      }, {
        label: 'Next',
        click: () => this.playlistCommands.skipTrackBy(1),
      }, {
        label: 'Random',
        click: () => this.playlistCommands.randomTrack(),
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        click: () => app.quit(),
      },
    ]);

    this.tray.setToolTip('Music Player');
    this.tray.setContextMenu(contextMenu);
  }

}
