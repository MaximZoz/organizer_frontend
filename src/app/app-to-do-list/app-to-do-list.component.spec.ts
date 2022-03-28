import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppToDoListComponent } from './app-to-do-list.component';

describe('AppToDoListComponent', () => {
  let component: AppToDoListComponent;
  let fixture: ComponentFixture<AppToDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppToDoListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppToDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
