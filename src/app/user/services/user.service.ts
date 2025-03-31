import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

const url: string = 'http://localhost:8080/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userList$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.userList$.asObservable();
  }

  loadUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(url)
      .pipe(tap((users) => this.userList$.next(users)));
  }

  addUsers(user: User): Observable<User> {
    return this.http.post<User>(url, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(url, user);
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete<any>(url + '/' + user.id);
  }
}
