import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { catchError, Observable, Subject, take, throwError } from 'rxjs';
import { Donation } from '../model/Donation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ERight } from '../../../permission/model/ERight';
import { MatDialog } from '@angular/material/dialog';
import { DonationService } from '../../services/donation.service';
import { RegisterDonationComponent } from '../register-donation/register-donation.component';
import { AuthorizationService } from '../../../core/authorization/service/authorization.service';
import { ColumnPredicate } from '../model/column-predicate';
import { AuthenticationService } from '../../../core/authentication/service/authentication.service';
import { ExportCSVService } from '../../../utils/services/export-csv.service';

enum Columns {
  Id = 'id',
  Campaign = 'campaign',
  Amount = 'amount',
  Currency = 'currency',
  Benefactor = 'benefactor',
  CreatedBy = 'createdBy',
  CreatedDate = 'createdDate',
  Approved = 'approved',
  ApprovedBy = 'approvedBy',
  ApprovedDate = 'approvedDate',
  Notes = 'notes',
}

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css'],
})
export class DonationListComponent implements OnInit, AfterContentInit {
  donationList$: Observable<Donation[]> = new Observable<Donation[]>();
  dataSource = new MatTableDataSource<Donation>();
  isLoading$ = new Subject<boolean>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly DONATION_MANAGEMENT: ERight = ERight.DONATION_MANAGEMENT;
  readonly DONATION_APPROVE: ERight = ERight.DONATION_APPROVE;
  readonly DONATION_REPORTING: ERight = ERight.DONATION_REPORTING;
  identityPredicate = (data, value) => true;

  columns = Columns;

  constructor(
    private donationService: DonationService,
    private dialog: MatDialog,
    private authorizationService: AuthorizationService,
    private authenticationService: AuthenticationService,
    private exportCSV: ExportCSVService
  ) {}

  get currentUser(): string {
    return this.authenticationService.getLoggedInUsername();
  }

  ngOnInit(): void {
    this.donationService.loadDonations().subscribe();
    this.donationList$ = this.donationService.getDonations();
    this.authorizationService.getPermissionsByRoles();
  }

  ngAfterContentInit() {
    this.donationList$.subscribe((donations) => {
      this.dataSource.data = donations;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.identityPredicate;
    });
  }

  onDonationAdd() {
    this.dialog.open(RegisterDonationComponent, { data: null });
  }

  onApprove(donation: Donation) {
    this.donationService.approveDonation(donation).subscribe(() => {
      this.donationService.loadDonations().pipe(take(1)).subscribe();
    });
  }

  private handleError(error: string): Observable<unknown> {
    this.isLoading$.next(false);
    return throwError(() => new Error(error));
  }

  onDonationDeleteClick(donation: Donation) {
    this.donationService
      .deleteDonation(donation)
      .pipe(catchError(this.handleError.bind(this)), take(1))
      .subscribe(() => {
        this.donationService.loadDonations().pipe(take(1)).subscribe();
        this.isLoading$.next(false);
        this.donationService.loadDonations().pipe(take(1)).subscribe();
      });
  }

  onDonationEditClick(donation: Donation) {
    this.dialog.open(RegisterDonationComponent, { data: donation });
  }

  composePredicateAnd(
    currentPredicates: (data, value) => boolean,
    newPredicate: (data, value) => boolean
  ) {
    return (data, value) => {
      return (
        currentPredicates.call(undefined, data, value) &&
        newPredicate.call(undefined, data, value)
      );
    };
  }

  applyFilter(filter: { columnPredicate: ColumnPredicate; filterValue: any }) {
    const newPredicate = (data: Donation) =>
      filter.columnPredicate.predicate.call(
        undefined,
        data[filter.columnPredicate.name]
      );
    this.dataSource.filterPredicate = this.composePredicateAnd(
      this.dataSource.filterPredicate,
      newPredicate
    );
    this.dataSource.filter = filter.filterValue;
  }

  applyCampaignFilter(filter: {
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }) {
    const newPredicate = (data: Donation) => {
      return filter.columnPredicate.predicate.call(
        undefined,
        data[filter.columnPredicate.name].name
      );
    };
    this.dataSource.filterPredicate = this.composePredicateAnd(
      this.dataSource.filterPredicate,
      newPredicate
    );
    this.dataSource.filter = filter.filterValue;
  }

  applyDonorFilter(filter: {
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }) {
    const newPredicate = (data: Donation) => {
      return filter.columnPredicate.predicate.call(
        undefined,
        data[filter.columnPredicate.name].firstName +
          ' ' +
          data[filter.columnPredicate.name].lastName
      );
    };
    this.dataSource.filterPredicate = this.composePredicateAnd(
      this.dataSource.filterPredicate,
      newPredicate
    );
    this.dataSource.filter = filter.filterValue;
  }

  applyApprovedFilter(filter: {
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }) {
    const newPredicate = (data: Donation) => {
      return filter.columnPredicate.predicate.apply(undefined, [
        data[filter.columnPredicate.name],
      ]);
    };
    this.dataSource.filterPredicate = this.composePredicateAnd(
      this.dataSource.filterPredicate,
      newPredicate
    );
    this.dataSource.filter = filter.filterValue;
  }

  clearAll() {
    this.dataSource.filterPredicate = this.identityPredicate;
    this.dataSource.filter = '';
  }

  exportToCSV() {
    const filteredData = this.dataSource.filteredData.slice();
    this.exportCSV.exportToCSV(filteredData);
  }
}
