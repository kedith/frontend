import { LoginRequest } from '../../modules/login-request';
import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LoginResponse } from '../../modules/login-response';
import { AuthenticationService } from '../../../core/authentication/service/authentication.service';
import { HandleErrorService } from '../../../utils/handle-error.service';
import { CustomErrorResponse } from '../../../utils/custom-error-response';
import { translate } from '@ngneat/transloco';
import { WebsocketService } from '../../../core/websocket/services/websocket.service';
import * as CryptoJS from 'crypto-js';
import {NotificationsService} from "../../../notifications/service/notifications.service";
import {HeaderComponent} from "../../../core/layout/header/header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  private key: string = '1234567890123456';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private handleErrorService: HandleErrorService,
    private websocketService: WebsocketService,
    private notificationService:NotificationsService,
  ) {
    this.loginForm = this.setUpForm();
  }

  onLogin() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    const encryptedPassword = this.encrypt(this.key, password);

    const loginRequest = new LoginRequest(username, encryptedPassword);
    this.loginService.login(loginRequest).subscribe(
      (loginResponse: LoginResponse) => {
        if (loginResponse.active) {
          localStorage.setItem('token', loginResponse.accessToken);

          this.authenticationService.firstLogin = loginResponse.firstLogin;
          this.authenticationService.setCurrentUser(loginResponse.username);

          this.websocketService.connect();
          if (loginResponse.firstLogin) {
            this.router.navigate(['password-change'], {
              queryParams: { username: this.loginForm.get('username')?.value },
            });
          } else {
            this.router.navigate(['home']);
          }
          this.notificationService.loadNotifications().subscribe();
        }
      },
      (error: CustomErrorResponse) => {
        this.handleErrorService.handleError(error as CustomErrorResponse);
      }
    );
  }

  encrypt(key, value) {
    key = CryptoJS.enc.Utf8.parse(key);
    return CryptoJS.AES.encrypt(value, key, { iv: key }).toString();
  }

  setUpForm() {
    return this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  getErrorMessageUsername() {
    if (this.loginForm.get('username')!.hasError('required')) {
      return translate('login.errors.usernameRequired');
    }

    return '';
  }

  getErrorMessagePassword() {
    if (this.loginForm.get('password')!.hasError('required')) {
      return translate('login.errors.passwordRequired');
    }

    return '';
  }
}
