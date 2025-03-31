import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import {
  catchError,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  throwError,
} from 'rxjs';
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';
import { User } from '../../models/user';
import { translate } from '@ngneat/transloco';
import { ERoleMapping } from '../../models/eRoleMapping';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campaign } from '../../../campaign/modules/campaign';
import { ERole } from '../../models/eRole';
import { CampaignService } from '../../../campaign/services/campaign.service';
import { CustomErrorResponse } from '../../../utils/custom-error-response';
import { HandleErrorService } from '../../../utils/handle-error.service';

interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string>;
  roles: FormControl<Role[]>;
  campaigns: FormControl<Campaign[] | null>;
}

@Component({
  selector: 'app-user-registry',
  templateUrl: './user-registry.component.html',
  styleUrls: ['./user-registry.component.css'],
})
export class UserRegistryComponent implements OnInit, OnDestroy {
  campaignList$: Observable<Campaign[]> = new Observable<Campaign[]>();
  userList$: Observable<User[]> = new Observable<User[]>();
  roleList$: Observable<Role[]> = new Observable<Role[]>();
  registerForm: FormGroup<RegisterForm>;
  selectedRoles: Role[] = [];

  isLoading$ = new Subject<boolean>();

  protected readonly translate = translate;
  protected readonly ERoleMapping = ERoleMapping;
  private componentDestroy$ = new Subject<void>();

  constructor(
    private handleErrorService: HandleErrorService,
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private campaignService: CampaignService,
    private dialogRef: MatDialogRef<UserRegistryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.registerForm = this.setUpForm();

    if (this.data) {
      this.fillOutFormWithUserData();
    }
  }

  ngOnInit() {
    this.userService.loadUsers().subscribe();
    this.userList$ = this.userService.getUsers();

    this.roleService.loadRoles().subscribe();
    this.roleList$ = this.roleService.getRoles();

    this.campaignService.loadCampaign().subscribe();
    this.campaignList$ = this.campaignService.getCampaigns();

    this.registerForm
      .get('roles')!
      .valueChanges.pipe(takeUntil(this.componentDestroy$))
      .subscribe((roles: Role[]) => {
        this.selectedRoles = roles;
        this.updateCampaignsAvailability();
      });
  }

  ngOnDestroy(): void {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }

  onSave() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading$.next(true);

    const formValue = this.registerForm.getRawValue();

    if (this.data) {
      const userPayload: User = {
        ...this.data,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        mobileNumber: formValue.phoneNumber || '',
        email: formValue.email,
        roles: formValue.roles,
        campaignList: formValue.campaigns,
      };

      this.userService
        .updateUser(userPayload)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.userService.loadUsers().pipe(take(1)).subscribe();
        });
      this.handleErrorService.handleSuccess('UPDATED_USER');
    } else {
      const userPayload: User = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        mobileNumber: formValue.phoneNumber || '',
        email: formValue.email,
        roles: formValue.roles,
        campaignList: formValue.campaigns,
        username: this.generateUsername(),
      };

      this.userService
        .addUsers(userPayload)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.userService.loadUsers().pipe(take(1)).subscribe();
        });
      this.handleErrorService.handleSuccess('ADDED_USER');
    }
  }

  private setUpForm() {
    return this.fb.group<RegisterForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z][a-zA-Z]+$'),
        ],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z][a-zA-Z]+$'),
        ],
      }),
      phoneNumber: new FormControl('', [
        Validators.pattern('^(00407|07|\\+407)\\d{8}$'),
      ]),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9]+[-]?[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+[-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z]+)+$'
          ),
        ],
      }),
      roles: new FormControl([] as Role[], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      campaigns: new FormControl({
        value: [] as Campaign[],
        disabled: true,
      }),
    });
  }

  private fillOutFormWithUserData(): void {
    const user = {
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      phoneNumber: this.data.mobileNumber,
      email: this.data.email,
      roles: this.data.roles,
      campaigns: this.data.campaignList,
    };

    this.registerForm.controls.firstName.disable();
    this.registerForm.controls.lastName.disable();

    this.selectedRoles = user.roles;
    this.registerForm.patchValue(user);

    this.updateCampaignsAvailability();
  }

  compareObjects(o1: Role | Campaign, o2: Role | Campaign): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  updateCampaignsAvailability() {
    const specificRoleSelected = this.selectedRoles.some(
      (role) => role.name === ERole.Reporter
    );

    if (specificRoleSelected) {
      this.registerForm.controls.campaigns.enable();
      this.registerForm.controls.campaigns.setValidators([Validators.required]);
    } else {
      this.registerForm.controls.campaigns.disable();
      this.registerForm.controls.campaigns.clearValidators();
    }
  }

  generateUsername() {
    const formValue = this.registerForm.getRawValue();
    let generatedUsername = '';

    if (formValue.lastName.length + formValue.firstName.length < 5) {
      generatedUsername = formValue.lastName + formValue.firstName + 'O0';
    } else if (formValue.lastName.length < 5) {
      generatedUsername =
        formValue.lastName.substring(0, formValue.lastName.length) +
        formValue.firstName.substring(0, 6 - formValue.lastName.length);
    } else {
      generatedUsername =
        formValue.lastName.substring(0, 5) +
        formValue.firstName.substring(0, 1);
    }

    let userNameAlreadyExist = false;
    let possibleUserNameMatch = '';
    let resultUsername: string = generatedUsername;

    this.userList$
      .pipe(
        map((users) => users.map((user) => user.username)),
        take(1)
      )
      .subscribe((usernames) => {
        userNameAlreadyExist = usernames.some((username) => {
          if (username === generatedUsername) {
            possibleUserNameMatch =
              usernames
                .filter((usrn) => usrn.includes(username))
                .sort()
                .pop() ?? '';
            return true;
          }
          return false;
        });
        if (userNameAlreadyExist) {
          const digitsSuffix = Number.parseInt(
            possibleUserNameMatch.match(/\d+/g)?.join('') ?? ''
          );
          if (!isNaN(digitsSuffix)) {
            resultUsername = possibleUserNameMatch.replace(
              /\d+/g,
              (digitsSuffix + 1).toString()
            );
          } else {
            resultUsername = possibleUserNameMatch.concat('1');
          }
        }
      });
    return resultUsername;
  }

  getErrorMessageFirstName() {
    if (this.registerForm.get('firstName')!.hasError('required')) {
      return translate('registry.errors.firstNameRequired');
    }

    if (this.registerForm.get('firstName')!.hasError('pattern')) {
      return translate('registry.errors.firstNameWrong');
    }

    return '';
  }

  getErrorMessageLastName() {
    if (this.registerForm.get('lastName')!.hasError('required')) {
      return translate('registry.errors.lastNameRequired');
    }

    if (this.registerForm.get('lastName')!.hasError('pattern')) {
      return translate('registry.errors.lastNameWrong');
    }

    return '';
  }

  getErrorMessageMobileNumber() {
    if (this.registerForm.get('mobileNumber')?.hasError('pattern')) {
      return translate('registry.errors.mobileNumberWrong');
    }

    return '';
  }

  getErrorMessageMail() {
    if (this.registerForm.get('email')!.hasError('required')) {
      return translate('registry.errors.mailRequired');
    }

    if (this.registerForm.get('email')!.hasError('pattern')) {
      return translate('registry.errors.mailWrong');
    }

    return '';
  }

  getErrorMessageRoles() {
    if (this.registerForm.get('roles')!.hasError('required')) {
      return translate('registry.errors.roleRequired');
    }

    return '';
  }

  getErrorMessageCampaigns() {
    if (this.registerForm.get('campaigns')!.hasError('required')) {
      return translate('registry.errors.campaignRequired');
    }

    return '';
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  private handleError(error: CustomErrorResponse): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error.message));
  }
}
