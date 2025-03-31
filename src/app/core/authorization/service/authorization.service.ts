import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Role } from '../../../user/models/role';
import { Right } from '../../../permission/model/Right';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ERole } from '../../../permission/model/ERole';
import { ERight } from '../../../permission/model/ERight';

const url: string = 'http://localhost:8080/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  userPermissions$: Observable<Right[]>;

  private _userPermissionsSubject = new BehaviorSubject<Right[]>([]);

  constructor(private http: HttpClient) {
    this.userPermissions$ = this._userPermissionsSubject.asObservable();
  }

  getUserRoles(): Role[] {
    const token = localStorage.getItem('token');

    if (token) {
      const { roles } = jwt_decode(token) as unknown & { roles: string[] };
      return roles.map((role) => {
        if (role === ERole.ADM) return <Role>{ name: role.toString(), id: 1 };
        else if (role === ERole.MGN)
          return <Role>{ name: role.toString(), id: 2 };
        else if (role === ERole.CEN)
          return <Role>{ name: role.toString(), id: 3 };
        else if (role === ERole.REP)
          return <Role>{ name: role.toString(), id: 4 };
        else return <Role>{ name: role };
      });
    }
    return [];
  }

  getAllRights(): Observable<Right[]> {
    return this.http.post<Right[]>(
      `${url}/getRightsForRoles`,
      this.getUserRoles()
    );
  }

  setPermissions(permissions: Right[]): void {
    this._userPermissionsSubject.next(permissions);
  }

  getPermissionsByRoles(): void {
    this.getAllRights()
      .pipe(take(1))
      .subscribe((permissions) => {
        this.setPermissions(permissions);
      });
  }

  hasPermissions(targetPermissions: ERight[]): Promise<boolean> {
    const userPermissions = this._userPermissionsSubject
      .getValue()
      .map((userPermission) => userPermission.name);
    return new Promise((resolve) => {
      resolve(
        targetPermissions.some((permission) =>
          userPermissions.includes(permission)
        )
      );
    });
  }
}
