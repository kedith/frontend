import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDonationComponent } from './register-donation.component';

describe('RegisterDonationComponent', () => {
  let component: RegisterDonationComponent;
  let fixture: ComponentFixture<RegisterDonationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterDonationComponent],
    });
    fixture = TestBed.createComponent(RegisterDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
