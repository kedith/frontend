import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { translate } from '@ngneat/transloco';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, Observable, Subject, take, throwError } from 'rxjs';
import { Campaign } from '../../modules/campaign';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegisterDonorComponent } from '../../../donor/components/register-donor/register-donor.component';
import { CampaignService } from '../../services/campaign.service';
import { HandleErrorService } from '../../../utils/handle-error.service';

interface RegisterForm {
  name: FormControl<string>;
  purpose: FormControl<string>;
}
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css'],
})
export class CampaignComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  campaignListAfter$: Observable<Campaign[]> = new Observable<Campaign[]>();
  campaignListBefore$: Observable<Campaign[]> = new Observable<Campaign[]>();
  campaignForm: FormGroup<RegisterForm>;
  showError: boolean = false;
  private componentDestroy$ = new Subject<void>();
  isLoading$ = new Subject<boolean>();
  protected readonly translate = translate;

  constructor(
    private http: HttpClient,
    private campaignService: CampaignService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDonorComponent>,
    private handleErrorService: HandleErrorService,
    @Inject(MAT_DIALOG_DATA) public data: Campaign
  ) {
    this.campaignForm = this.setUpForm();
    if (this.data) {
      this.fillOutForm();
    }
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }
  onSave() {
    if (this.campaignForm.invalid) {
      return;
    }
    this.isLoading$.next(true);

    const formValue = this.campaignForm.getRawValue();
    const campaign: Campaign = {
      name: formValue.name,
      purpose: formValue.purpose,
      id: this.data ? this.data.id : null,
    };

    if (campaign.id === null) {
      this.campaignService.loadCampaign().pipe().subscribe();
      this.campaignListBefore$ = this.campaignService.getCampaigns();
      this.campaignService
        .addCampaign(campaign)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.campaignService.loadCampaign().pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.campaignService.loadCampaign().pipe(take(1)).subscribe();
          this.handleErrorService.handleSuccess('ADDED_CAMPAIGN');
        });
      this.campaignService.loadCampaign().pipe().subscribe();
      this.campaignListAfter$ = this.campaignService.getCampaigns();
      if (
        Object.keys(this.campaignListBefore$).length ===
        Object.keys(this.campaignListAfter$).length
      ) {
        this.showError = true;
      }
    }

    if (campaign.id !== null) {
      this.campaignService
        .updateCampaign(campaign)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.campaignService.loadCampaign().pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
          this.campaignService.loadCampaign().pipe(take(1)).subscribe();
          this.handleErrorService.handleSuccess('UPDATED_CAMPAIGN');
        });
    }
  }
  private setUpForm() {
    return this.fb.group<RegisterForm>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[A-Z][a-z ]+$')],
      }),
      purpose: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^(.|\\s)*[a-zA-Z]+(.|\\s)*$'),
        ],
      }),
    });
  }

  private fillOutForm() {
    const campaign = {
      name: this.data.name,
      purpose: this.data.purpose,
    };
    this.campaignForm.patchValue(campaign);
  }

  updateCampaignsAvailability() {
    // const specificRoleSelected = this.selectedRoles.some(role => role.name === 'REP');
    //
    // if (specificRoleSelected) {
    //   this.campaignsControl.enable();
    //   this.campaignsControl.setValidators([Validators.required]);
    // } else {
    //   this.campaignsControl.disable();
    //   this.campaignsControl.clearValidators();
    // }
    //
    // this.campaignsControl.updateValueAndValidity();
  }
  getErrorMessageName() {
    if (this.campaignForm.get('name')!.hasError('required')) {
      return translate('errors.campaign.name.required');
    }

    if (this.campaignForm.get('name')!.hasError('pattern')) {
      return translate('errors.campaign.name.pattern');
    }

    return '';
  }
  getErrorMessagePurpose() {
    if (this.campaignForm.get('purpose')!.hasError('required')) {
      return translate('errors.campaign.purpose.required');
    }

    if (this.campaignForm.get('purpose')!.hasError('pattern')) {
      return translate('errors.campaign.purpose.pattern');
    }

    return '';
  }

  private handleError(error: string): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error));
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }
}
