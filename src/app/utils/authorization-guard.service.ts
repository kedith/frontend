import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../core/authorization/service/authorization.service';
import { AuthenticationService } from '../core/authentication/service/authentication.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (state.url.includes('password-change')) {
      return this.authenticationService.firstLogin;
    }

    if (
      !this.authenticationService.isLoggedIn() &&
      state.url.includes('login')
    ) {
      return true;
    }

    if (
      !this.authenticationService.isLoggedIn() &&
      !state.url.includes('login')
    ) {
      return this.router.createUrlTree(['home']);
    }

    if (
      this.authenticationService.isLoggedIn() &&
      state.url.includes('login')
    ) {
      return false;
    }

    return this.authorizationService.hasPermissions(route.data['rights']);
  }
}
