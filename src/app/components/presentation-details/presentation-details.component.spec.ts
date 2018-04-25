import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationDetailsComponent } from './presentation-details.component';

describe('PresentationDetailsComponent', () => {
  let component: PresentationDetailsComponent;
  let fixture: ComponentFixture<PresentationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
