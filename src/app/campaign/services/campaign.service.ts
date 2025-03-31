import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Campaign } from '../modules/campaign';
import { HandleErrorService } from '../../utils/handle-error.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  isLoading$ = new Subject<boolean>();
  campaignList$: BehaviorSubject<Campaign[]> = new BehaviorSubject<Campaign[]>(
    []
  );
  constructor(
    private handleErrorService: HandleErrorService,
    private http: HttpClient
  ) {}

  getCampaigns() {
    return this.campaignList$.asObservable();
  }

  loadCampaign(): Observable<Campaign[]> {
    return this.http
      .get<Campaign[]>('http://localhost:8080/campaign')
      .pipe(tap((campaign) => this.campaignList$.next(campaign)));
  }

  addCampaign(campaign: Campaign): Observable<Campaign> {
    // this.handleErrorService.handleSuccess('ADDED_CAMPAIGN');
    return this.http.post<Campaign>('http://localhost:8080/campaign', campaign);
  }

  updateCampaign(campaign: Campaign): Observable<Campaign> {

    return this.http.put<Campaign>(
      `http://localhost:8080/campaign/${campaign.id}`,
      campaign
    );
  }
  private handleError(error: string): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error));
  }

  deleteCampaign(campaign: Campaign): Observable<Campaign> {
    this.handleErrorService.handleSuccess('DELETED_CAMPAIGN');
    return this.http.delete<Campaign>(
      `http://localhost:8080/campaign/${campaign.id}`
    );
  }
}
