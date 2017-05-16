import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SjfComponent } from './sjf.component';

describe('SjfComponent', () => {
  let component: SjfComponent;
  let fixture: ComponentFixture<SjfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SjfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SjfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
