import { Injectable } from '@angular/core';

import { AudioService } from 'core/audio.service';
import { NotificationsService } from 'core/ui/notifications';

@Injectable()
export class AudioErrorsNotifier {

  constructor(
    notificationsService: NotificationsService,
    audio: AudioService,
  ) {
    audio.errors$.subscribe(error => {
      notificationsService.push({
        type: 'error',
        message: error.message,
        secondaryContent: () => error.description,
      });
    });
  }

}
