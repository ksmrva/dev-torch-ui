import { TestBed } from '@angular/core/testing';

import { CodeModelSourceFileService } from './code-model-source-file.service';

describe('CodeModelFileService', () => {
  let service: CodeModelSourceFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelSourceFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
