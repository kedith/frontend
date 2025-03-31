import { Injectable } from '@angular/core';
import { LoginResponse } from '../modules/login-response';
import { LoginRequest } from '../modules/login-request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url: string = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, loginRequest);
  }
}
