import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeReqComponent } from './dispute-req.component';

describe('DisputeReqComponent', () => {
  let component: DisputeReqComponent;
  let fixture: ComponentFixture<DisputeReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeReqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
