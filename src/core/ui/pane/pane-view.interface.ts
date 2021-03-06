import { Observable } from 'rxjs';

export interface ViewInstantiationParams {
  componentClass: any;
  options: any;
}
export interface PaneView {
  key: string;
  displayName$?: Observable<string>;
  displayName?: string;
  serialization$?: Observable<any>;
  deserialize?: (Object) => void;
  activate?: () => void;
  search?: (string) => void;
}
