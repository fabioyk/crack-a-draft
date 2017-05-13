import { TestBed, inject } from '@angular/core/testing';

import { MtgApiService } from './mtg-api.service';

describe('MtgApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MtgApiService]
    });
  });

  it('should ...', inject([MtgApiService], (service: MtgApiService) => {
    expect(service).toBeTruthy();
  }));
});
