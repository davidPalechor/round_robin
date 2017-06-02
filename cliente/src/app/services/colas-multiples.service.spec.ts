import { TestBed, inject } from '@angular/core/testing';

import { ColasMultiplesService } from './colas-multiples.service';

describe('ColasMultiplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColasMultiplesService]
    });
  });

  it('should ...', inject([ColasMultiplesService], (service: ColasMultiplesService) => {
    expect(service).toBeTruthy();
  }));
});
