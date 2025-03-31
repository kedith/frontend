import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from './core/authentication/service/authentication.service';
import { AuthorizationService } from './core/authorization/service/authorization.service';
import { ThemeService } from './core/theme/theme.service';
import { filter, fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  lightTheme$: Observable<boolean>;
  private componentDestroy$ = new Subject<void>();

  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private themeService: ThemeService,
    private _overlayContainer: OverlayContainer,
    private router: Router
  ) {
    this.lightTheme$ = this.themeService.lightTheme$;

    this.lightTheme$
      .pipe(takeUntil(this.componentDestroy$))
      .subscribe((lightTheme) => {
        this.applyAppThemeToDialogs(lightTheme);
      });
    this.authenticationService.currentUser$.subscribe(() => {
      if (this.authenticationService.isLoggedIn()) {
        this.authorizationService.getPermissionsByRoles();
      } else {
        this.authorizationService.setPermissions([]);
      }
    });
  }

  ngOnInit(): void {
    this.listenToSessionStorageChanges();
  }

  ngOnDestroy() {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }

  private listenToSessionStorageChanges() {
    fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event.storageArea === localStorage),
        filter((event) => event.key === 'token'),
        map((event) => event.newValue),
        takeUntil(this.componentDestroy$)
      )
      .subscribe((tokenValue) => {
        if (!tokenValue) {
          this.authenticationService.setCurrentUser(null);
        } else {
          this.authenticationService.setCurrentUser(
            this.authenticationService.getLoggedInUsername()
          );
        }
        this.router.navigate(['home']);
      });
  }

  private applyAppThemeToDialogs(lightTheme: boolean) {
    const overlayContainerClasses =
      this._overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
      (item: string) => item.includes('-theme')
    );
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(lightTheme ? 'light-theme' : 'dark-theme');
  }
}
