import { TestBed } from '@angular/core/testing';
import { DatabaseModelSourceService } from './db-model-source.service';

describe('DatabaseModelSourceService', () => {
  let service: DatabaseModelSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseModelSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
