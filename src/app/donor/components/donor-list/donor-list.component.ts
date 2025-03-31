import {
  AfterContentInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { DonorService } from '../../services/donor.service';
import { Donor } from '../../models/donor';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDonorComponent } from '../register-donor/register-donor.component';
import { ERight } from '../../../permission/model/ERight';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { translate } from '@ngneat/transloco';
import { ExportCSVService } from '../../../utils/services/export-csv.service';

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.css'],
})
export class DonorListComponent implements OnInit, AfterContentInit, OnDestroy {
  @Output() editEventEmitter = new EventEmitter<string>();
  donorList$: Observable<Donor[]> = new Observable<Donor[]>();
  tableColumns = [
    'Actions',
    'ID',
    'Firstname',
    'Lastname',
    'Additional name',
    'Maiden name',
  ];
  campaignId: number;
  donorList = new MatTableDataSource<Donor>();
  readonly BENEF_MANAGEMENT = ERight.BENEF_MANAGEMENT;
  readonly CAMP_REPORTING = ERight.CAMP_REPORTING;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('donorTable') donorTable: MatTable<Donor>;

  private componentDestroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private donorService: DonorService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private exportCSV: ExportCSVService
  ) {
    this.activatedRoute.params
      .pipe(takeUntil(this.componentDestroy$))
      .subscribe((params) => {
        this.campaignId = params['id'];
      });
  }

  ngOnInit(): void {
    if (this.campaignId) {
      this.donorService
        .loadDonorsByCampaign(this.campaignId)
        .pipe(take(1))
        .subscribe();
    } else {
      this.donorService.loadDonors().pipe(take(1)).subscribe();
    }
    this.donorList$ = this.donorService.getDonors();
  }

  ngAfterContentInit(): void {
    this.donorList$
      .pipe(takeUntil(this.componentDestroy$))
      .subscribe((donors) => {
        this.donorList.data = donors;
        this.donorList.paginator = this.paginator;
        this.donorList.sort = this.sort;
      });
  }

  ngOnDestroy() {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
  }

  onEdit(donor: Donor): void {
    this.dialog.open(RegisterDonorComponent, {
      data: { donor, campaignId: this.campaignId },
    });
  }

  onAdd() {
    this.dialog.open(RegisterDonorComponent, {
      data: { donor: null, campaignId: this.campaignId },
    });
  }

  onDelete(donor: Donor) {
    this.donorService.deleteDonor(donor.id, this.campaignId).subscribe();
    this.toastr.success(translate('success.DELETED_DONOR'));
  }

  exportToCSV() {
    const filteredData = this.donorList.filteredData.slice();
    this.exportCSV.exportToCSV(filteredData);
  }
}
