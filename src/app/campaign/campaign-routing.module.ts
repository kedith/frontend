import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../utils/authorization-guard.service';
import { CampaignTableComponent } from './components/campaign-table/campaign-table.component';
import { ERight } from '../permission/model/ERight';

const routes: Routes = [
  {
    path: '',
    component: CampaignTableComponent,
    canActivate: [AuthorizationGuard],
    data: {
      rights: [
        ERight.CAMP_MANAGEMENT,
        ERight.CAMP_REPORT_RESTRICTED,
        ERight.CAMP_REPORTING,
      ],
    },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
