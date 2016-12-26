// import { dialog } from 'electron';
const {dialog} = (<any>window).require('electron').remote;

import { Command } from 'app/commands';
import { Track } from 'app/plugins/playlist';

// @Command()
function scan_disk_for_music() {
  console.log('scan_disk_for_music')
  ;
  let files = dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections'],
  });


}

Command({})(scan_disk_for_music);
