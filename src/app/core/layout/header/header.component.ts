import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {TranslocoDirective, TranslocoPipe, TranslocoService} from '@ngneat/transloco';
import { HasPermissionsDirective } from '../../authorization/directives/has-permissions.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { ERight } from '../../../permission/model/ERight';
import { AuthenticationService } from '../../authentication/service/authentication.service';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter, map, Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization/service/authorization.service';
import { ThemeService } from '../../theme/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import {NotificationsService} from "../../../notifications/service/notifications.service";
import {Notifications} from "../../../notifications/model/notification";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    FlexLayoutModule,
    TranslocoPipe,
    HasPermissionsDirective,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgIf,
    NgOptimizedImage,
    MatListModule,
    MatSidenavModule,
    AsyncPipe,
    MatMenuModule,
    DatePipe,
    NgForOf,
    TranslocoDirective,
    MatCardModule,
  ],
})
export class HeaderComponent implements OnInit{
  currentUser$: Observable<string | null>;
  notificationList$: Observable<Notifications[]>;

  @Output() sideNavToggle = new EventEmitter<void>();

  readonly USER_PERMISSION = ERight.USER_MANAGEMENT;
  readonly PERMISSION_MANAGEMENT = ERight.PERMISSION_MANAGEMENT;
  readonly CAMP_MANAGEMENT = ERight.CAMP_MANAGEMENT;
  readonly BENEF_MANAGEMENT = ERight.BENEF_MANAGEMENT;
  readonly DONATION_REPORTING = ERight.DONATION_REPORTING;
  readonly CAMP_REPORT_RESTRICTED = ERight.CAMP_REPORT_RESTRICTED;
  readonly CAMP_REPORTING = ERight.CAMP_REPORTING;
  isPasswordChangeCurrentRoute$: Observable<boolean>;
  lightTheme$: Observable<boolean>;

  constructor(
    private transLocoService: TranslocoService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private themeService: ThemeService,
    private notifications: NotificationsService,

  ) {
    this.currentUser$ = this.authenticationService.currentUser$;
    this.authorizationService.userPermissions$.subscribe();
    this.isPasswordChangeCurrentRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.includes('password-change'))
    );
    this.lightTheme$ = this.themeService.lightTheme$;
  }
  ngOnInit() {
    // this.notifications.loadNotifications().subscribe();
    // this.notificationList$ = this.getAllNotifications();
    this.notificationList$ = this.getAllNotifications();

    this.notifications.getNotificationsUpdatedObservable().subscribe(() => {
      this.notificationList$ = this.getAllNotifications();
    });
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

  onSidenavToggle() {
    this.sideNavToggle.next();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
