import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorModelComponent } from './operator-model.component';

describe('OperatorModelComponent', () => {
  let component: OperatorModelComponent;
  let fixture: ComponentFixture<OperatorModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
