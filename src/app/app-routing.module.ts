import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'donations',
    loadChildren: () =>
      import('./donation/donation.module').then((m) => m.DonationModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'donors',
    loadChildren: () =>
      import('./donor/donor.module').then((m) => m.DonorModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'password-change',
    loadChildren: () =>
      import('./password-change/password-change.module').then(
        (m) => m.PasswordChangeModule
      ),
  },
  {
    path: 'campaigns',
    loadChildren: () =>
      import('./campaign/campaign.module').then((m) => m.CampaignModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
