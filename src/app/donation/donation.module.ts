import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DonationRoutingModule } from './donation-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HasPermissionsDirective } from '../core/authorization/directives/has-permissions.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterDonationComponent } from './components/register-donation/register-donation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { TextFilterComponent } from './components/filters/text-filter/text-filter.component';
import { DateFilterComponent } from './components/filters/date-filter/date-filter.component';
import { NumberFilterComponent } from './components/filters/number-filter/number-filter.component';
import { ApprovedFilterComponent } from './components/filters/approved-filter/approved-filter.component';

@NgModule({
  declarations: [
    DonationListComponent,
    RegisterDonationComponent,
    TextFilterComponent,
    NumberFilterComponent,
    DateFilterComponent,
    ApprovedFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    DonationRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    TranslocoDirective,
    MatPaginatorModule,
    TranslocoPipe,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatFormFieldModule,
    HasPermissionsDirective,
    MatTooltipModule,
    MatMenuModule,
    MatGridListModule,
    FormsModule,
    MatListModule,
  ],
  providers: [MatDatepickerModule, DatePipe],
})
export class DonationModule {}
