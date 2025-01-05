import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulebookingComponent } from './schedulebooking.component';

describe('SchedulebookingComponent', () => {
  let component: SchedulebookingComponent;
  let fixture: ComponentFixture<SchedulebookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulebookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulebookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
