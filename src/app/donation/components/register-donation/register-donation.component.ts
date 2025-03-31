import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Donation } from '../model/Donation';
import { catchError, Observable, Subject, take, throwError } from 'rxjs';
import { Donor } from '../../../donor/models/donor';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DonationService } from '../../services/donation.service';
import { translate } from '@ngneat/transloco';
import { DonorService } from '../../../donor/services/donor.service';
import jwt_decode from 'jwt-decode';
import { ECurrency } from '../model/eCurrency';
import { Campaign } from '../../../campaign/modules/campaign';
import { CampaignService } from '../../../campaign/services/campaign.service';
import { CustomErrorResponse } from '../../../utils/custom-error-response';

interface DonationForm {
  amount: FormControl<number>;
  currency: FormControl<ECurrency>;
  campaign: FormControl<Campaign>;
  benefactor: FormControl<Donor>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-register-donation',
  templateUrl: './register-donation.component.html',
  styleUrls: ['./register-donation.component.css'],
})
export class RegisterDonationComponent implements OnInit, OnDestroy {
  donationForm: FormGroup<DonationForm>;

  isLoading$ = new Subject<boolean>();

  ECurrency = ECurrency;
  protected readonly Object = Object;
  protected readonly translate = translate;
  private componentDestroy$ = new Subject<void>();
  campaignList$: Observable<Campaign[]> = new Observable<Campaign[]>();
  donorList$: Observable<Donor[]> = new Observable<Donor[]>();

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private donorService: DonorService,
    private campaignService: CampaignService,
    private dialogRef: MatDialogRef<RegisterDonationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Donation
  ) {
    this.donationForm = this.setUpForm();

    if (this.data) {
      this.fillOutFormWithDonationData();
    }
  }

  ngOnInit() {
    this.donorService.loadDonors().subscribe();
    this.donorList$ = this.donorService.getDonors();

    this.campaignService.loadCampaign().subscribe();
    this.campaignList$ = this.campaignService.getCampaigns();
  }

  ngOnDestroy(): void {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }

  onSave() {
    if (this.donationForm.invalid) {
      return;
    }

    this.isLoading$.next(true);

    const formValue = this.donationForm.getRawValue();
    const donation: Donation = {
      ...this.data,
      amount: formValue.amount,
      currency: formValue.currency,
      campaign: formValue.campaign,
      createdBy: this.getUsernameFromToken(),
      createdDate: new Date(),
      benefactor: formValue.benefactor,
      approved: false,
      approvedBy: null,
      approvedDate: null,
      notes: formValue.notes,
    };

    if (!this.data?.id) {
      this.donationService
        .addDonation(donation)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.donationService.loadDonations().pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
        });
    }

    if (this.data?.id) {
      this.donationService
        .updateDonation(donation)
        .pipe(catchError(this.handleError.bind(this)), take(1))
        .subscribe(() => {
          this.donationService.loadDonations().pipe(take(1)).subscribe();
          this.isLoading$.next(false);
          this.dialogRef.close();
        });
    }
  }

  compareCampaignObjects(o1: Campaign, o2: Campaign): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
  compareDonorObjects(o1: Donor, o2: Donor): boolean {
    return (
      o1.firstName === o2.firstName &&
      o1.lastName === o2.lastName &&
      o1.id === o2.id
    );
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');

    if (token) {
      const { sub } = jwt_decode(token) as unknown & { sub: string };
      return sub;
    }

    return null;
  }

  private setUpForm() {
    return this.fb.group<DonationForm>({
      amount: new FormControl(0, {
        validators: [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^[0-9]+(\.[0-9]+)?$/),
        ],
      }),
      currency: new FormControl(null, {
        validators: [Validators.required],
      }),
      campaign: new FormControl(null, {
        validators: [Validators.required],
      }),
      benefactor: new FormControl(null, {
        validators: [Validators.required],
      }),
      notes: new FormControl(''),
    });
  }

  private fillOutFormWithDonationData(): void {
    const donation: Donation = {
      ...this.data,
      amount: this.data.amount,
      currency: this.data.currency,
      campaign: this.data.campaign,
      createdBy: this.data.createdBy,
      createdDate: this.data.createdDate,
      benefactor: this.data.benefactor,
      approved: this.data.approved,
      approvedBy: this.data.approvedBy,
      approvedDate: this.data.approvedDate,
      notes: this.data.notes,
    };

    this.donationForm.patchValue(donation);
  }

  getErrorMessageAmount() {
    if (
      this.donationForm.get('amount')!.hasError('required') ||
      this.donationForm.get('amount')!.hasError('min') ||
      this.donationForm.get('amount')!.hasError('pattern')
    ) {
      return translate('registerdonation.errors.amountRequired');
    }
    return '';
  }

  getErrorMessageCurrency() {
    if (this.donationForm.get('currency')!.hasError('required')) {
      return translate('registerdonation.errors.currencyRequired');
    }
    return '';
  }

  getErrorMessageCampaign() {
    if (this.donationForm.get('campaign')!.hasError('required')) {
      return translate('registerdonation.errors.campaignRequired');
    }
    return '';
  }

  getErrorMessageBenefactor() {
    if (this.donationForm.get('benefactor')!.hasError('required')) {
      return translate('registerdonation.errors.benefactorRequired');
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
