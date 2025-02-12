import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicLoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: ClinicLoginComponent;
  let fixture: ComponentFixture<ClinicLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
