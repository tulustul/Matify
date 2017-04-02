import { Observable } from 'rxjs';

export interface ViewInstantiationParams {
  componentClass: any;
  options: any;
}
export interface PaneView {
  key: string;
  displayName$: Observable<string>;
  needSerialization$?: Observable<any>;
  serialize?: () => Object;
  deserialize?: (Object) => void;
  activate?: () => void;
  search?: (string) => void;
}
