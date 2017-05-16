import { TestBed, inject } from '@angular/core/testing';

import { SjfService } from './sjf.service';

describe('SjfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SjfService]
    });
  });

  it('should ...', inject([SjfService], (service: SjfService) => {
    expect(service).toBeTruthy();
  }));
});
