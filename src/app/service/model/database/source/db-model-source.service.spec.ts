import { TestBed } from '@angular/core/testing';
import { DbModelSourceService } from './db-model-source.service';

describe('DbModelSourceService', () => {
  let service: DbModelSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbModelSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
