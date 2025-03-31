import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Role } from '../model/Role';

import { HttpClient } from '@angular/common/http';
import { Right } from '../model/Right';
import { take } from 'rxjs';
import { AuthorizationService } from '../../core/authorization/service/authorization.service';
import { HandleErrorService } from '../../utils/handle-error.service';
import { TranslocoService } from '@ngneat/transloco';
import { ERight } from '../model/ERight';
import { Router } from '@angular/router';

interface PermissionsForm {
  role: FormControl<Role>;
  rights: FormControl<Right[]>;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
})
export class PermissionComponent implements OnInit {
  permissionForm: FormGroup<PermissionsForm>;
  roles: Role[] = [];
  rights: Right[] = [];
  rightsSelected: Right[] = [];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private handleError: HandleErrorService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
    this.permissionForm = this.formBuilder.group({
      role: new FormControl(null),
      rights: new FormControl({ value: [], disabled: true }),
    });
  }

  getRoles(): void {
    this.http
      .get<Role[]>('http://localhost:8080/roles/getRoles')
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.roles = response;
        }
      });
  }

  getRights(): void {
    this.http
      .get<Right[]>('http://localhost:8080/right/getRights')
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.rights = response;
          this.permissionForm.get('rights')!.setValue(response);
        }
      });
  }

  getRightsSelected(): void {
    const { role } = this.permissionForm.value;

    this.http
      .get<Right[]>(`http://localhost:8080/right/getRightsSelected/${role.id}`)
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.rightsSelected = response;
          const preselectedData = {
            role: role,
            rights: this.rightsSelected,
          };
          this.permissionForm.patchValue(preselectedData);
          this.permissionForm.get('rights')!.enable();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getRights();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  onSubmit() {
    const { role, rights } = this.permissionForm.value;
    this.http
      .put<Right[]>(
        `http://localhost:8080/roles/updateRoles/${role.id}`,
        rights
      )
      .pipe(take(1))
      .subscribe(() => {
        this.authorizationService.getPermissionsByRoles();
        if (
          !rights
            .map((right) => right.name)
            .includes(ERight.PERMISSION_MANAGEMENT)
        ) {
          this.router.navigate(['home']);
        }
      });
    this.handleError.handleSuccess('SAVE_PERMISSION');
  }
}

