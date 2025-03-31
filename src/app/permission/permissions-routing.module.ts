import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './components/permission.component';
import { AuthorizationGuard } from '../utils/authorization-guard.service';
import { ERight } from './model/ERight';

const routes: Routes = [
  {
    path: 'permissions',
    component: PermissionComponent,
    canActivate: [AuthorizationGuard],
    data: { rights: [ERight.PERMISSION_MANAGEMENT] },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionsRoutingModule {}
