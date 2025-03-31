import { Role } from './role';
import { Campaign } from '../../campaign/modules/campaign';

export interface User {
  active?: boolean;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  mobileNumber?: string;
  id?: number;
  firstLogin?: boolean;
  campaignList?: Campaign[];
  version?: number;
}
