import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeeSummaryComponent } from './oee-summary.component';

describe('OeeSummaryComponent', () => {
  let component: OeeSummaryComponent;
  let fixture: ComponentFixture<OeeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OeeSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
