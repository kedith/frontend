import { Donor } from '../../../donor/models/donor';
import { ECurrency } from './eCurrency';
import { Campaign } from '../../../campaign/modules/campaign';

export interface Donation {
  id: number;
  amount: number;
  currency: ECurrency;
  campaign: Campaign;
  createdBy: string; // username
  createdDate: Date;
  benefactor: Donor;
  approved?: boolean;
  approvedBy?: string; // different username
  approvedDate?: Date;
  notes?: string;
  version?: number;
}
