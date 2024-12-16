import { TestBed } from '@angular/core/testing';

import { SqlModelDetailService } from './sql-model-detail.service';

describe('SqlModelDetailService', () => {
  let service: SqlModelDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlModelDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
