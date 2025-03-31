import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HandleErrorService } from './handle-error.service';
import { CustomErrorResponse } from './custom-error-response';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private toastrService: HandleErrorService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set(
        'Authorization',
        localStorage.getItem('token') ?? ``
      ),
    });
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastrService.handleError(error.error as CustomErrorResponse);
        return throwError('');
      })
    );
  }
}
