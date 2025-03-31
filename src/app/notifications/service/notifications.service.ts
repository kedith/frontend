import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {Notifications} from "../model/notification";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user/models/user";
const url = "http://localhost:8080/notifications"
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationList$ = new BehaviorSubject<Notifications[]>([]);
  private notificationsUpdated$ = new Subject<void>();
  constructor(private http: HttpClient) { }
  getNotifications(){
    return this.notificationList$.asObservable();
  }
  loadNotifications(){
    return this.http
      .get<Notifications[]>(url)
      .pipe(tap((notification)=>this.notificationList$.next(notification)))
  }
  loadNotificationByUser(user:User){
    return this.http
      .get<Notifications[]>(url+"/"+user.username)
      .pipe(tap((notification)=>this.notificationList$.next(notification)))

  }
  getNotificationsUpdatedObservable(): Observable<void> {
    return this.notificationsUpdated$.asObservable();
  }
  addNotification(Notification:Notifications){
    this.notificationsUpdated$.next();
    return this.http.post<Notifications>(url,Notification);
  }
}
