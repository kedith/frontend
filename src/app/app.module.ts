import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { DonationModule } from './donation/donation.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Interceptor } from './utils/http-interceptor';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { AuthorizationGuard } from './utils/authorization-guard.service';
import { TranslocoRootModule } from './transloco-root.module';
import { provideTransloco } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { PasswordChangeModule } from './password-change/password-change.module';
import { HomeComponent } from './home/home.component';
import { DonorModule } from './donor/donor.module';
import { PermissionsModule } from './permission/permissions.module';
import { LoginModule } from './login/login.module';
import { CampaignModule } from './campaign/campaign.module';
import { ToastrModule } from 'ngx-toastr';
import { HandleErrorService } from './utils/handle-error.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorizationService } from './core/authorization/service/authorization.service';
import { Observable, of, take } from 'rxjs';
import { Right } from './permission/model/Right';
import { AuthenticationService } from './core/authentication/service/authentication.service';
import { NgOptimizedImage } from '@angular/common';

function initializeAppFactory(
  authorizationService: AuthorizationService,
  authenticationService: AuthenticationService
): () => Observable<Right[]> {
  return () => {
    return authenticationService.isLoggedIn()
      ? authorizationService.getAllRights().pipe(take(1))
      : of([]);
  };
}
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    UserModule,
    DonationModule,
    PermissionsModule,
    LoginModule,
    AppRoutingModule,
    PasswordChangeModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    CampaignModule,
    NavbarComponent,
    DonorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 4,
      closeButton: true,
      autoDismiss: true,
    }),
    NgOptimizedImage,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    AuthorizationGuard,
    TranslocoRootModule,
    provideTransloco({
      config: {
        availableLangs: ['en', 'ro'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    HandleErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthorizationService, AuthenticationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
