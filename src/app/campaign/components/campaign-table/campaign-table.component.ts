import {
  AfterContentInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  Observable,
  Subject,
  take,
  takeUntil,
  throwError,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../modules/campaign';
import { CampaignComponent } from '../campaign/campaign.component';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ERight } from '../../../permission/model/ERight';
import { ExportCSVService } from '../../../utils/services/export-csv.service';

@Component({
  selector: 'app-campaigntabel',
  templateUrl: './campaign-table.component.html',
  styleUrls: ['./campaign-table.component.css'],
})
export class CampaignTableComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  @Output() editEventEmitter = new EventEmitter<string>();
  campaignList$: Observable<Campaign[]> = new Observable<Campaign[]>();
  dataSource = new MatTableDataSource<Campaign>();
  private componentDestroy$ = new Subject<void>();
  isLoading$ = new Subject<boolean>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly CAMP_REPORTING = ERight.CAMP_REPORTING;
  readonly CAMP_MANAGEMENT = ERight.CAMP_MANAGEMENT;
  constructor(
    private dialog: MatDialog,
    private campaignService: CampaignService,
    private router: Router,
    private exportCSV: ExportCSVService
  ) {}

  ngAfterContentInit() {
    this.campaignList$.subscribe((campaigns) => {
      this.dataSource.data = campaigns;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngOnInit(): void {
    this.campaignService
      .loadCampaign()
      .pipe(takeUntil(this.componentDestroy$))
      .subscribe();

    this.campaignList$ = this.campaignService.getCampaigns();
  }

  ngOnDestroy(): void {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }

  private handleError(error: string): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error));
  }
  onCampaignAddClick(): void {
    this.dialog.open(CampaignComponent, { data: null });
  }
  onCampaignEditClick(campaign: Campaign) {
    this.dialog.open(CampaignComponent, { data: campaign });
  }
  onCampaignDeleteClick(campaign: Campaign) {
    this.campaignService
      .deleteCampaign(campaign)
      .pipe(catchError(this.handleError.bind(this)), take(1))
      .subscribe(() => {
        this.campaignService.loadCampaign().pipe(take(1)).subscribe();
        this.isLoading$.next(false);
        this.campaignService.loadCampaign().pipe(take(1)).subscribe();
      });
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDonorClick(donorId: string) {
    this.router.navigate([`donors/${donorId}`]);
  }

  exportToCSV() {
    const filteredData = this.dataSource.filteredData.slice();
    this.exportCSV.exportToCSV(filteredData);
  }
}
