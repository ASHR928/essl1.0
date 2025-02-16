import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeRequestComponent } from './dispute-request.component';

describe('DisputeRequestComponent', () => {
  let component: DisputeRequestComponent;
  let fixture: ComponentFixture<DisputeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
