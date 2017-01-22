import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { ModalsService } from './modals.service';
import { Keybindings } from 'core/keybindings.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.visible]': 'isOpened',
  },
})
export class ModalComponent {

  isOpened = false;

  isInputVisible = false;

  question: string;

  value: string;

  @ViewChild('input') input: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalsService: ModalsService,
    keybindings: Keybindings,
  ) {
    this.modalsService.state$.subscribe(state => {
      setTimeout(() => {
        this.value = '';
        this.isOpened = state.isOpened;
        this.isInputVisible = state.isInputVisible;
        this.question = state.question;
        this.cdr.markForCheck();
        setTimeout(() => {
          (this.input.nativeElement as HTMLElement).focus();
        });
      });
    });

    keybindings.keys$.subscribe(key => {
      if (!this.isOpened) {
        return;
      }
      if (key === 'escape') {
        this.reject();
      } else if (key === 'enter') {
        this.resolve();
      }
    });
  }

  resolve() {
    let value = this.isInputVisible ? this.value : true;
    this.isOpened = false;
    this.modalsService.resolve(value);
    this.cdr.markForCheck();
  }

  reject() {
    this.isOpened = false;
    this.modalsService.resolve(false);
    this.cdr.markForCheck();
  }

}
