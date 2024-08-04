import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTMachineStatusComponent } from './rtmachine-status.component';

describe('RTMachineStatusComponent', () => {
  let component: RTMachineStatusComponent;
  let fixture: ComponentFixture<RTMachineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTMachineStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTMachineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
