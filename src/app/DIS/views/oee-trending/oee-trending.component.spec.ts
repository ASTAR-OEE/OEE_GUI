import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeeTrendingComponent } from './oee-trending.component';

describe('OeeTrendingComponent', () => {
  let component: OeeTrendingComponent;
  let fixture: ComponentFixture<OeeTrendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OeeTrendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OeeTrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
