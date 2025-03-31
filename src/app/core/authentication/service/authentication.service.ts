import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser$: Observable<string | null>;

  private currentUserSubject$ = new BehaviorSubject<string | null>(
    this.getLoggedInUsername()
  );

  private _firstLogin = false;

  constructor(private router: Router) {
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get firstLogin() {
    return this._firstLogin;
  }

  logout() {
    localStorage.removeItem('token');
    this.setCurrentUser(null);
    this.router.navigate(['/login']);
  }

  getLoggedInUsername(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const { sub: username } = jwt_decode(token) as
        | (unknown & { sub: string })
        | null;
      return username;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject$.getValue() && !this._firstLogin;
  }

  setCurrentUser(username?: string): void {
    this.currentUserSubject$.next(username);
  }

  set firstLogin(firstLogin: boolean) {
    this._firstLogin = firstLogin;
  }
}
