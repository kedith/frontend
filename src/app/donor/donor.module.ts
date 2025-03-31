import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonorListComponent } from './components/donor-list/donor-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { RegisterDonorComponent } from './components/register-donor/register-donor.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HasPermissionsDirective } from '../core/authorization/directives/has-permissions.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DonorRoutingModule } from './donor-routing.module';

@NgModule({
  declarations: [DonorListComponent, RegisterDonorComponent],
  exports: [DonorListComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    RouterLink,
    TranslocoDirective,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoPipe,
    MatDialogModule,
    MatProgressSpinnerModule,
    HasPermissionsDirective,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    DonorRoutingModule,
  ],
})
export class DonorModule {}
