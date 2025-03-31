import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Donor } from '../models/donor';

const url: string = 'http://localhost:8080/donors';
@Injectable({
  providedIn: 'root',
})
export class DonorService {
  donorList$: BehaviorSubject<Donor[]> = new BehaviorSubject<Donor[]>([]);

  constructor(private http: HttpClient) {}

  getDonors() {
    return this.donorList$.asObservable();
  }

  loadDonors(): Observable<Donor[]> {
    return this.http
      .get<Donor[]>(url)
      .pipe(tap((donors) => this.donorList$.next(donors)));
  }

  loadDonorsByCampaign(campaignId: number): Observable<Donor[]> {
    return this.http
      .get<Donor[]>(`${url}/campaign/${campaignId}`)
      .pipe(tap((donors) => this.donorList$.next(donors)));
  }

  addDonors(donor: Donor): Observable<Donor> {
    return this.http.post<Donor>(url, donor);
  }

  updateDonor(donor: Donor): Observable<Donor> {
    return this.http.put<Donor>(url, donor);
  }

  deleteDonor(donorId: number, campaignId?: number): Observable<void> {
    const deleteUrl = `${url}/${donorId}`;
    return this.http
      .delete<void>(deleteUrl)
      .pipe(
        tap(() =>
          (campaignId
            ? this.loadDonorsByCampaign(campaignId)
            : this.loadDonors()
          ).subscribe()
        )
      );
  }
}
