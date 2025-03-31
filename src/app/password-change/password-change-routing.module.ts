import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { AuthorizationGuard } from '../utils/authorization-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangeComponent,
    canActivate: [AuthorizationGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PasswordChangeRoutingModule {}
