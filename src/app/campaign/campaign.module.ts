import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './components/campaign/campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { CampaignTableComponent } from './components/campaign-table/campaign-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CampaignRoutingModule } from './campaign-routing.module';
import { HasPermissionsDirective } from '../core/authorization/directives/has-permissions.directive';

@NgModule({
  declarations: [CampaignComponent, CampaignTableComponent],
  exports: [CampaignTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoPipe,
    MatTableModule,
    TranslocoDirective,
    MatProgressSpinnerModule,
    MatDialogModule,
    RouterLink,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    CampaignRoutingModule,
    HasPermissionsDirective,
  ],
})
export class CampaignModule {}
