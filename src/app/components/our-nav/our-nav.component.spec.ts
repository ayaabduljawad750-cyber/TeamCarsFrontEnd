import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurNavComponent } from './our-nav.component';

describe('OurNavComponent', () => {
  let component: OurNavComponent;
  let fixture: ComponentFixture<OurNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurNavComponent]
    });
    fixture = TestBed.createComponent(OurNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
