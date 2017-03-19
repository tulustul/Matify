import { Injectable } from '@angular/core';

import * as fs from 'fs';
import * as jsmediatags from 'jsmediatags';

import { Observable, Observer } from 'rxjs';

import { remote } from 'electron';

import { deleteDB } from 'core/db';
import { Command } from 'core/commands';

import { ModalsService } from 'core/ui/modals';
import { NotificationsService, Notification } from 'core/ui/notifications';

import { LocalTrack, LocalTrackWord } from './localTrack.model';

const dialog = remote.dialog;

@Injectable()
export class Scan {

  status = {
    files: 0,
    tracks: 0,
    total: 0,
    gathering: false,
  };

  tracks: LocalTrack[];

  constructor(
    private notifications: NotificationsService,
    private modals: ModalsService,
  ) {}

  @Command()
  async deleteDB() {
    let remove = await this.modals.ask(
      'Are you sure you want delete your database? ' +
      'All your playlists and library will be gone.'
    );
    if (remove) {
      deleteDB();
      this.notifications.push({message: 'DB deleted'});
    }
  }

  @Command({
    displayName: 'Add directory to library',
  })
  async scan_disk_for_music() {
    this.tracks = [];

    this.status.files = 0;
    this.status.tracks = 0;
    this.status.total = 0;
    this.status.gathering = true;

    let paths = dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    let notification: Notification;

    if (paths.length) {
      notification = this.notifications.push({
        message: 'Scanning music...',
        disposable: false,
        args: this.status,
        secondaryContent: status => {
          if (status.gathering) {
            return `Gathering files...`;
          } else {
            return (
              `${status.files} / ${status.total} ` +
              `${(status.files / status.total * 100).toFixed(1)}%<br>` +
              `Got ${status.tracks} tracks.`
            );
          }
        }
      });
    }

    let files: string[];

    for (let path of paths) {
      try {
        files = await walk(path);
      } catch (e) {
        notification.message = e;
        this.notifications.scheduleDispose(notification);
      }

      this.status.gathering = false;
      this.status.total = files.length;
      for (let file of files) {
        await this.handleFile(file);
      }
    }

    await LocalTrack.store.bulkAdd(this.tracks);

    this.index(notification);

    notification.message = 'Scanning finished';
    this.notifications.scheduleDispose(notification);
  }

  async index(notification: Notification) {
    notification.message = 'Indexing...';
    let tracks = await LocalTrack.store.toArray();

    let localTrackWords: LocalTrackWord[] = [];
    for (let track of tracks) {
      let words = this.getTrackWords(track, 'title');
      words = words.concat(this.getTrackWords(track, 'album'));
      words = words.concat(this.getTrackWords(track, 'artist'));
      words = words.concat(this.getTrackWords(track, 'genre'));

      for (let word of words) {
        localTrackWords.push({
          localTrackId: track.id,
          word: word,
        });
      }
    }

    await LocalTrackWord.store.bulkAdd(localTrackWords);
  }

  getTrackWords(track: LocalTrack, property: string) {
    let phrase = (track[property] || '').trim();
    return phrase ? phrase.split(' ') : [];
  }

  handleFile(filepath: string) {
    return new Promise<void>((resolve, reject) => {
      this.status.files++;
      jsmediatags.read(filepath, {
        onSuccess: tag => {
          this.status.tracks++;
          // Getting duration through Audio is too slow
          // let audio = new Audio(filepath);
          // audio.addEventListener('loadedmetadata', () => {
          //   console.log(audio.duration);
          // });
          this.tracks.push({
            uri: filepath,
            source: 'disk',
            title: tag.tags.title || null,
            album: tag.tags.album || null,
            artist: tag.tags.artist || null,
            year: tag.tags.year || null,
            track: tag.tags.track || null,
            genre: tag.tags.genre || null,
            artworkUri: '',
            length: null,
          });
          resolve();
        },
        onError: error => {
          console.log(':(', error.type, error.info);
          resolve();
        }
      });
    });
  }
}

function walk(path: string, fileslist = []) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        reject(`scan error: ${err}`);
      } else {
        for (let file of files) {
          let nextPath = path + '/' + file;
          if (fs.statSync(nextPath).isDirectory()) {
            await walk(nextPath, fileslist);
          } else {
            fileslist.push(nextPath);
          }
        }
        resolve(fileslist);
      }
    });
  });
}
