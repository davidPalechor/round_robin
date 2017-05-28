import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SRTFComponent } from './srtf.component';

describe('SRTFComponent', () => {
  let component: SRTFComponent;
  let fixture: ComponentFixture<SRTFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SRTFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SRTFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
