import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePunchLogComponent } from './attendance-punch-log.component';

describe('AttendancePunchLogComponent', () => {
  let component: AttendancePunchLogComponent;
  let fixture: ComponentFixture<AttendancePunchLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancePunchLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePunchLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
