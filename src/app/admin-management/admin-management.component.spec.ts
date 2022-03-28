import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserManagementComponent } from './admin-management.component';

describe('AllUserManagementComponent', () => {
  let component: AllUserManagementComponent;
  let fixture: ComponentFixture<AllUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
