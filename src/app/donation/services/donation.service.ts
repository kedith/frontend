import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Donation } from '../components/model/Donation';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from '../../utils/handle-error.service';
import { AuthenticationService } from '../../core/authentication/service/authentication.service';

const URL = 'http://localhost:8080/donations';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  donationList$: BehaviorSubject<Donation[]> = new BehaviorSubject<Donation[]>(
    []
  );

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private handleError: HandleErrorService
  ) {}

  getDonations() {
    return this.donationList$.asObservable();
  }

  loadDonations() {
    return this.http
      .get<Donation[]>(URL)
      .pipe(tap((donations) => this.donationList$.next(donations)));
  }

  addDonation(donation: Donation): Observable<Donation> {
    this.handleError.handleSuccess('ADDED_DONATION');
    return this.http.post<Donation>(URL, donation);
  }

  updateDonation(donation: Donation): Observable<Donation> {
    this.handleError.handleSuccess('UPDATED_DONATION');
    return this.http.put<Donation>(URL + `/` + donation.id, donation);
  }

  approveDonation(donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(
      URL + `/approve/` + donation.id,
      this.authenticationService.getLoggedInUsername()
    );
  }
  deleteDonation(donation: Donation): Observable<Donation> {
    return this.http.delete<Donation>(URL + `/` + donation.id);
  }
}
