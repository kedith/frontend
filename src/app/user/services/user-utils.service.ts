import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserUtilsService {
  noWhiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const hasWhiteSpace = control.value && control.value.trim().length === 0;
      return hasWhiteSpace ? { whiteSpace: true } : null;
    };
  }
}
