import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDipsutereqNotifComponent } from './manager-dipsutereq-notif.component';

describe('ManagerDipsutereqNotifComponent', () => {
  let component: ManagerDipsutereqNotifComponent;
  let fixture: ComponentFixture<ManagerDipsutereqNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDipsutereqNotifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDipsutereqNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
