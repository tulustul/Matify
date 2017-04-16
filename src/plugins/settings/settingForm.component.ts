import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  OnInit,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Setting } from 'core/plugging';
import { Settings } from 'core/settings.service';

import { FORMS_REGISTRY, SettingForm } from './forms';

@Component({
  selector: 'mp-setting-form',
  template: '<div #form></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingFormComponent implements OnInit {

  @ViewChild('form', { read: ViewContainerRef })
  form: ViewContainerRef;

  @Input()
  setting: Setting;

  formControl = new FormControl();

  constructor(
    private cfr: ComponentFactoryResolver,
    private settings: Settings,
  ) {}

  ngOnInit() {
    this.formControl.setValue(this.settings[this.setting.key]);
    this.formControl.valueChanges.debounceTime(1000).subscribe(value => {
      this.settings.userSettings[this.setting.key] = value;
      this.settings.saveUserSettings();
    });

    const componentClass = FORMS_REGISTRY[this.setting.component];
    const factory = this.cfr.resolveComponentFactory(componentClass);
    const component = this.form.createComponent(factory).instance as SettingForm;

    component.formControl = this.formControl;
    (<any>component).name = this.setting.key;
  }

}
