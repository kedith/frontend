import {User} from "../../user/models/user";
import {ENotification} from "./ENotification";

export class Notifications{
  id:number;
  actor:User;
  notifier:User;
  notificationType:ENotification;
  extraInfo:string;
  date:Date;
}
