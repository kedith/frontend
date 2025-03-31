import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { AuthorizationGuard } from '../utils/authorization-guard.service';
import { ERight } from '../permission/model/ERight';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    data: {
      rights: [ERight.DONATION_REPORTING, ERight.CAMP_REPORT_RESTRICTED],
    },
    component: DonationListComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationRoutingModule {}
