import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { Campaign } from '../../campaign/modules/campaign';
import { Donation } from '../../donation/components/model/Donation';
import { Donor } from '../../donor/models/donor';

@Injectable({
  providedIn: 'root',
})
export class ExportCSVService {
  constructor() {}

  exportToCSV(data: Campaign[] | Donation[] | Donor[]) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
