import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DonorListComponent } from './components/donor-list/donor-list.component';
import { ERight } from '../permission/model/ERight';
import { AuthorizationGuard } from '../utils/authorization-guard.service';

const routes: Routes = [
  {
    path: ':id',
    canActivate: [AuthorizationGuard],
    data: { rights: [ERight.BENEF_MANAGEMENT, ERight.CAMP_REPORT_RESTRICTED] },
    component: DonorListComponent,
  },
  {
    path: '',
    canActivate: [AuthorizationGuard],
    data: { rights: [ERight.BENEF_MANAGEMENT] },
    component: DonorListComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorRoutingModule {}
