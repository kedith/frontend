import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe } from '@ngneat/transloco';
import { PasswordChangeRoutingModule } from './password-change-routing.module';

@NgModule({
  declarations: [PasswordChangeComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    TranslocoPipe,
    PasswordChangeRoutingModule,
  ],
})
export class PasswordChangeModule {}
