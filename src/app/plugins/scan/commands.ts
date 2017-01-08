// import { dialog } from 'electron';
const {dialog} = (<any>window).require('electron').remote;

import { Command } from 'app/commands';
import { Track } from 'app/plugins/track';

export class Commands {

  @Command({
    displayName: 'Add directory to library',
  })
  scan_disk_for_music() {
    console.log('scan_disk_for_music');
    let files = dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    });
    console.log(files);
  }

  @Command()
  test_command() {
    console.log('scan_disk_for_music');
  }
}
