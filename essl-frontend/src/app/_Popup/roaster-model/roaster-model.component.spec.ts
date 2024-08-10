import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoasterModelComponent } from './roaster-model.component';

describe('RoasterModelComponent', () => {
  let component: RoasterModelComponent;
  let fixture: ComponentFixture<RoasterModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoasterModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoasterModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
