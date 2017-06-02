import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColasMultiplesComponent } from './colas-multiples.component';

describe('ColasMultiplesComponent', () => {
  let component: ColasMultiplesComponent;
  let fixture: ComponentFixture<ColasMultiplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColasMultiplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColasMultiplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
