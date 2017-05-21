import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit
} from '@angular/core';

import { DiscoverService } from './discover.service';

@Component({
  selector: 'mp-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent implements OnInit {

  constructor(private discoverService: DiscoverService) {}

  ngOnInit() {
    if (this.discoverService.tracks.length === 0) {
      this.discoverTracks();
    }
  }

  async discoverTracks() {
    await this.discoverService.discover();
  }

}
