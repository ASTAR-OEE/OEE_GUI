import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaReportComponent } from './ava-report.component';

describe('AvaReportComponent', () => {
  let component: AvaReportComponent;
  let fixture: ComponentFixture<AvaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
