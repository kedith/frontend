import { TestBed } from '@angular/core/testing';

import { ExportCSVService } from './export-csv.service';

describe('ExportCSVService', () => {
  let service: ExportCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
