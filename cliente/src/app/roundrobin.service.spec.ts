import { TestBed, inject } from '@angular/core/testing';

import { RoundrobinService } from './roundrobin.service';

describe('RoundrobinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoundrobinService]
    });
  });

  it('should ...', inject([RoundrobinService], (service: RoundrobinService) => {
    expect(service).toBeTruthy();
  }));
});
