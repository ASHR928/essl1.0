import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWarningComponentComponent } from './session-warning-component.component';

describe('SessionWarningComponentComponent', () => {
  let component: SessionWarningComponentComponent;
  let fixture: ComponentFixture<SessionWarningComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionWarningComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionWarningComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
