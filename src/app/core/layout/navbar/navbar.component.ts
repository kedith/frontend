import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthenticationService } from '../../authentication/service/authentication.service';
import {
  TranslocoDirective,
  TranslocoPipe,
  TranslocoService,
} from '@ngneat/transloco';
import {AsyncPipe, DatePipe, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import { HasPermissionsDirective } from '../../authorization/directives/has-permissions.directive';
import { ERight } from '../../../permission/model/ERight';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorizationService } from '../../authorization/service/authorization.service';
import { HeaderComponent } from '../header/header.component';
import { filter, map, Observable } from 'rxjs';
import {MatMenuModule} from "@angular/material/menu";
import {Notifications} from "../../../notifications/model/notification";
import { ThemeService } from '../../theme/theme.service';
import {NotificationsService} from "../../../notifications/service/notifications.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
    TranslocoPipe,
    NgIf,
    NgFor,
    HasPermissionsDirective,
    NgOptimizedImage,
    MatTooltipModule,
    AsyncPipe,
    MatMenuModule,
    DatePipe,
    HeaderComponent,
  ],
  standalone: true,
})
export class NavbarComponent {
  currentUser$: Observable<string | null>;

  readonly USER_PERMISSION = ERight.USER_MANAGEMENT;
  readonly PERMISSION_MANAGEMENT = ERight.PERMISSION_MANAGEMENT;
  readonly CAMP_MANAGEMENT = ERight.CAMP_MANAGEMENT;
  readonly DONATION_REPORTING = ERight.DONATION_REPORTING;
  readonly BENEF_MANAGEMENT = ERight.BENEF_MANAGEMENT;
  readonly CAMP_REPORT_RESTRICTED = ERight.CAMP_REPORT_RESTRICTED;
  readonly CAMP_REPORTING = ERight.CAMP_REPORTING;
  isPasswordChangeCurrentRoute$: Observable<boolean>;
  notificationList$: Observable<Notifications[]>;
  public lightTheme$: Observable<boolean>;
  constructor(
    private transLocoService: TranslocoService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private notifications: NotificationsService,
    private themeService: ThemeService
  ) {
    this.authorizationService.userPermissions$.subscribe();
    this.isPasswordChangeCurrentRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.includes('password-change'))
    );
    this.currentUser$ = this.authenticationService.currentUser$;
    this.lightTheme$ = this.themeService.lightTheme$;
  }
  ngOnInit() {
    this.notifications.loadNotifications().subscribe();
    this.notificationList$ = this.getAllNotifications();
  }

  getAllNotifications(): Observable<Notifications[]> {
    return this.notifications.getNotifications();
  }
  onLanguageChange() {
    const activeLang = this.transLocoService.getActiveLang();
    this.transLocoService.setActiveLang(activeLang === 'en' ? 'ro' : 'en');
  }

  isEnglishSelected() {
    return this.transLocoService.getActiveLang() === 'en';
  }

  isUserLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
