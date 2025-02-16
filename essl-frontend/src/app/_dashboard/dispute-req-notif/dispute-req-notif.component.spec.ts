import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeReqNotifComponent } from './dispute-req-notif.component';

describe('DisputeReqNotifComponent', () => {
  let component: DisputeReqNotifComponent;
  let fixture: ComponentFixture<DisputeReqNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeReqNotifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeReqNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
