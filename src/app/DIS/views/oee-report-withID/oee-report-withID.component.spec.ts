import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OEEReportWithIDComponent} from './oee-report-withID.component';

describe('OEEReportComponent', () => {
  let component: OEEReportWithIDComponent;
  let fixture: ComponentFixture<OEEReportWithIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OEEReportWithIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OEEReportWithIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
