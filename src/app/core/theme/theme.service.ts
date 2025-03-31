import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  lightTheme$: Observable<boolean>;
  private _lightThemeSubject$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.lightTheme$ = this._lightThemeSubject$.asObservable();
  }

  toggleTheme() {
    this._lightThemeSubject$.next(!this._lightThemeSubject$.getValue());
  }
}
