import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PasswordChangeService } from '../../services/password-change.service';
import { PasswordChangeUtilsService } from '../../services/password-change-utils.service';
import { UserUtilsService } from '../../../user/services/user-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/authorization/service/authorization.service';
import { AuthenticationService } from '../../../core/authentication/service/authentication.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private passwordChangeService: PasswordChangeService,
    private passwordUtilService: PasswordChangeUtilsService,
    private userUtilService: UserUtilsService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService
  ) {
    this.changePasswordForm = this.setUpForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
    });
  }

  onSave() {
    let newPassword = this.changePasswordForm.get('newPassword')?.value;
    if (newPassword != null) {
      this.passwordChangeService
        .updateUser(this.username, newPassword)
        .subscribe(() => {
          this.router.navigate(['home']);
          this.authenticationService.firstLogin = false;
          this.authorizationService.getPermissionsByRoles();
        });
    }
  }

  private setUpForm() {
    return this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_+.]).{8,}$/
            ),
            this.userUtilService.noWhiteSpaceValidator(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordUtilService.passwordValidator()] }
    );
  }
}
