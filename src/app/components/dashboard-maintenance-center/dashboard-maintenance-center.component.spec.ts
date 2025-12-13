import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMaintenanceCenterComponent } from './dashboard-maintenance-center.component';

describe('DashboardMaintenanceCenterComponent', () => {
  let component: DashboardMaintenanceCenterComponent;
  let fixture: ComponentFixture<DashboardMaintenanceCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMaintenanceCenterComponent]
    });
    fixture = TestBed.createComponent(DashboardMaintenanceCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
