import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role } from '../models/role';

const url: string = 'http://localhost:8080/roles';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  roleList$: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.roleList$.asObservable();
  }

  loadRoles(): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${url}/getRoles`)
      .pipe(tap((roles) => this.roleList$.next(roles)));
  }
}
