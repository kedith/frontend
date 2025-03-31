import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedFilterComponent } from './approved-filter.component';

describe('ApprovedFilterComponent', () => {
  let component: ApprovedFilterComponent;
  let fixture: ComponentFixture<ApprovedFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedFilterComponent],
    });
    fixture = TestBed.createComponent(ApprovedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
