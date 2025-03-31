import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthorizationGuard } from '../utils/authorization-guard.service';
import { ERight } from '../permission/model/ERight';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthorizationGuard],
    data: { rights: [ERight.USER_MANAGEMENT] },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
