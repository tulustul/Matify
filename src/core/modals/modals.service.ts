import { Subject } from 'rxjs';

export interface State {
  isOpened: boolean,
  isInputVisible: boolean,
  question: string,
}

export class ModalsService {

  private _state$ = new Subject<State>();
  state$ = this._state$.asObservable();

  _resolve: (result: string|boolean) => void;

  getInput(question: string) {
    this._state$.next({
      isOpened: true,
      isInputVisible: true,
      question,
    });
    return this.makePromise();
  }

  ask(question: string) {
    this._state$.next({
      isOpened: true,
      isInputVisible: false,
      question,
    });
    return this.makePromise();
  }

  makePromise() {
    return new Promise<string|boolean>((resolve, reject) => {
      this._resolve = resolve;
    });
  }

  resolve(result?: string|boolean) {
    this._resolve(result);
  }

}
