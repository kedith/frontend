import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordChangeUtilsService {
  passwordValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('newPassword');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      // Perform null checks before using the controls
      if (!passwordControl || !confirmPasswordControl) {
        return null; // If either control is missing, validation passes
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ matchingPasswords: true });
        return { matchingPasswords: true }; // Validation fails
      } else {
        confirmPasswordControl.setErrors(null); // Clear the error if validation passes
        return null; // Validation passes
      }
    };
  }
}
