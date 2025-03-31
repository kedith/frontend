import { User } from '../../models/user';
import { Observable } from 'rxjs';
import {
  AfterContentInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistryComponent } from '../user-registry/user-registry.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '../../../core/authentication/service/authentication.service';
import { HandleErrorService } from '../../../utils/handle-error.service';
import { ERoleMapping } from '../../models/eRoleMapping';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, AfterContentInit {
  @Output() editEventEmitter = new EventEmitter<string>();
  userList$: Observable<User[]> = new Observable<User[]>();
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loggedInUser: String;

  ngAfterContentInit() {
    this.userList$.subscribe((users) => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthenticationService,
    private handleErrorService: HandleErrorService
  ) {}

  ngOnInit(): void {
    this.userService.loadUsers().subscribe();
    this.userList$ = this.userService.getUsers();

    this.loggedInUser = this.authService.getLoggedInUsername();
  }

  triggerEditActiveStatusUser(user: User): void {
    user.active = !user.active;

    this.userService.updateUser(user).subscribe(
      (response) => {this.handleErrorService.handleSuccess('UPDATED_USER');},
      (error) => {
        this.handleErrorService.handleError(error);
      }
    );

  }

  onUserAddClick(): void {
    this.dialog.open(UserRegistryComponent, { data: null });
  }

  onUserEditClick(user: User) {
    this.dialog.open(UserRegistryComponent, { data: user });
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected readonly ERoleMapping = ERoleMapping;
}
