import { TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectService } from './code-model-source-project.service';

describe('CodeModelSourceProjectService', () => {
  let service: CodeModelSourceProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelSourceProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
