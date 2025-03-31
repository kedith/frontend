import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

const URL: string = 'http://localhost:8080/users/update-password';

@Injectable({
  providedIn: 'root',
})
export class PasswordChangeService {
  constructor(private http: HttpClient) {}

  updateUser(username: string, password: string) {
    return this.http.put<HttpResponse<any>>(URL + '/' + username, password);
  }
}
