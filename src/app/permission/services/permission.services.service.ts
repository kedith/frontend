import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../model/Role';
import { Right } from '../model/Right';

const url: string = 'http://localhost:8080/roles/getRoles';

@Injectable({
  providedIn: 'root',
})
export class PermissionServicesService {
  constructor(private http: HttpClient) {}

  getList1(): Observable<Role[]> {
    // Replace with your API endpoint for list 1
    return this.http.get<Role[]>(url);
  }

  getList2(): Observable<Right[]> {
    // Replace with your API endpoint for list 2
    return this.http.get<Right[]>('http://localhost:8080/rights');
  }
}
