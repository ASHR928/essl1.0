import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRosterNotifComponent } from './manager-roster-notif.component';

describe('ManagerRosterNotifComponent', () => {
  let component: ManagerRosterNotifComponent;
  let fixture: ComponentFixture<ManagerRosterNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRosterNotifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRosterNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
