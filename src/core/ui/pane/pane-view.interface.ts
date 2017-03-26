import { Observable } from 'rxjs';

export interface ViewInstantiationParams {
  componentClass: any;
  options: any;
}
export interface PaneView {
  displayName$: Observable<string>;
  serialize: () => Object;
  deserialize: (Object) => void,
  activate: () => void,
}
