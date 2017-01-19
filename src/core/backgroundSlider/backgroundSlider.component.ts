import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'background-slider',
  templateUrl: './backgroundSlider.component.html',
  styleUrls: ['./backgroundSlider.component.scss'],
})
export class BackgroundSliderComponent implements OnInit, OnDestroy {

  @ViewChild('clickArea')
  clickArea: ElementRef;

  @Input()
  color: string;

  @Input()
  value: number;

  @Output()
  change = new EventEmitter<number>();

  savedValue: number;

  wheelHandler: EventListenerOrEventListenerObject;

  clickHandler(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let value = event.offsetX / target.clientWidth * 100;
    this.setValue(value);
  }

  panHandler(event: HammerInput) {
    let target = event.target as HTMLElement;
    let offset = event.deltaX / target.clientWidth * 100;
    let newValue = this.savedValue + offset;
    this.setValue(newValue);
  }

  panStartHandler() {
    this.savedValue = this.value;
  }

  ngOnInit() {
    this.wheelHandler = (event: WheelEvent) => {
      let newValue = this.value;
      if (event.wheelDeltaY > 0) {
        newValue += 5;
      } else if (event.wheelDeltaY < 0) {
        newValue -= 5;
      }
      this.setValue(newValue);
    };

    this.element.addEventListener('wheel', this.wheelHandler);
  }

  ngOnDestroy() {
    this.element.removeEventListener('wheel', this.wheelHandler);
  }

  setValue(value: number) {
    value = Math.max(0, Math.min(100, value));

    if (value !== this.value) {
      this.value = value;
      this.change.next(this.value);
    }
  }

  get element() {
    return this.clickArea.nativeElement as HTMLElement;
  }

}
