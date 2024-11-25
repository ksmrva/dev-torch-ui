import { TestBed } from '@angular/core/testing';

import { CodeModelFileService } from './code-model-file.service';

describe('CodeModelFileService', () => {
  let service: CodeModelFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
