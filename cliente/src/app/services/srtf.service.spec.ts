import { TestBed, inject } from '@angular/core/testing';

import { SrtfService } from './srtf.service';

describe('SrtfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SrtfService]
    });
  });

  it('should ...', inject([SrtfService], (service: SrtfService) => {
    expect(service).toBeTruthy();
  }));
});
