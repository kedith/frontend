import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { CustomErrorResponse } from './custom-error-response';

@Injectable({
  providedIn: 'root',
})
export class HandleErrorService {
  constructor(
    private toaster: ToastrService,
    private transloco: TranslocoService
  ) {}

  public handleError(err: CustomErrorResponse) {
    if (err !== undefined && err.errorCode !== undefined) {
      var message = 'errors.ErrorCode.' + err.errorCode;
      this.toaster.error(this.transloco.translate(message), 'Error', {
        timeOut: 0,
        extendedTimeOut: 0,
      });
    }
  }
  public handleSuccess(suc: string) {
    if (suc) this.toaster.success(this.transloco.translate('success.' + suc));
  }
  public handleInformative(info: string) {
    if (info) this.toaster.info(info);
  }
}
