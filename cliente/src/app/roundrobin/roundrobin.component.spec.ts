import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundrobinComponent } from './roundrobin.component';

describe('RoundrobinComponent', () => {
  let component: RoundrobinComponent;
  let fixture: ComponentFixture<RoundrobinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundrobinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundrobinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
