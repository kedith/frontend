import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, Observable, Subject, take, throwError } from 'rxjs';
import { Donor } from '../../models/donor';
import { DonorService } from '../../services/donor.service';
import { translate } from '@ngneat/transloco';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  additionalName: FormControl<string | null>;
  maidenName: FormControl<string | null>;
}

@Component({
  selector: 'app-register-donor',
  templateUrl: './register-donor.component.html',
  styleUrls: ['./register-donor.component.css'],
})
export class RegisterDonorComponent implements OnInit, OnDestroy {
  registerForm: FormGroup<RegisterForm>;
  isLoading$ = new Subject<boolean>();
  private componentDestroy$ = new Subject<void>();
  protected readonly translate = translate;

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private dialogRef: MatDialogRef<RegisterDonorComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { donor: Donor; campaignId: number }
  ) {
    this.registerForm = this.setUpForm();
    this.registerForm.controls.maidenName.removeValidators(Validators.required);
    this.registerForm.controls.additionalName.removeValidators(
      Validators.required
    );
    if (this.data) {
      this.fillOutFormWithUserData();
    }
  }

  ngOnInit() {}

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
    const donor: Donor = {
      ...this.data.donor,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      additionalName: formValue.additionalName || '',
      maidenName: formValue.maidenName || '',
    };

    if (this.data.donor?.id) {
      this.donorService
        .updateDonor(donor)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          console.log(this.data.campaignId);
          const loadDonorsFn = this.data.campaignId
            ? this.donorService.loadDonorsByCampaign(this.data.campaignId)
            : this.donorService.loadDonors();
          loadDonorsFn.pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.toastr.success(translate('success.UPDATED_DONOR'));
        });
    }
    if (!this.data.donor?.id) {
      this.donorService
        .addDonors(donor)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.donorService.loadDonors().pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.toastr.success(translate('success.ADDED_DONOR'));
        });
    }
  }

  private setUpForm() {
    return this.fb.group<RegisterForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[A-Z][a-z]+$')],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[A-Z][a-z]+$')],
      }),
      additionalName: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[A-Z][a-z]+$')],
      }),
      maidenName: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[A-Z][a-z]+$')],
      }),
    });
  }

  private fillOutFormWithUserData(): void {
    const donor = {
      firstName: this.data.donor?.firstName,
      lastName: this.data.donor?.lastName,
      additionalName: this.data.donor?.additionalName,
      maidenName: this.data.donor?.maidenName,
    };

    this.registerForm.patchValue(donor);
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

  onDialogClose(): void {
    this.dialogRef.close();
  }

  private handleError(error: string): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error));
  }
}
