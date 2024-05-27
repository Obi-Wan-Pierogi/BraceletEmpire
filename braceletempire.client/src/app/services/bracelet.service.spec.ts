import { TestBed } from '@angular/core/testing';

import { BraceletService } from './bracelet.service';

describe('BraceletService', () => {
  let service: BraceletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BraceletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
