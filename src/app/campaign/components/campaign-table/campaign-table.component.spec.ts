import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTableComponent } from './campaign-table.component';

describe('CampaigntabelComponent', () => {
  let component: CampaignTableComponent;
  let fixture: ComponentFixture<CampaignTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignTableComponent],
    });
    fixture = TestBed.createComponent(CampaignTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
