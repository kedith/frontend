import { TestBed } from '@angular/core/testing';

import { PermissionServicesService } from './permission.services.service';

describe('PermissionServicesService', () => {
  let service: PermissionServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
