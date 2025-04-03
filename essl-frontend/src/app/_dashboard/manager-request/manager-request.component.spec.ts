import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRequestComponent } from './manager-request.component';

describe('ManagerRequestComponent', () => {
  let component: ManagerRequestComponent;
  let fixture: ComponentFixture<ManagerRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
