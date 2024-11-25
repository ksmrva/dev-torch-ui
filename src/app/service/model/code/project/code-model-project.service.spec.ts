import { TestBed } from '@angular/core/testing';

import { CodeModelProjectService } from './code-model-project.service';

describe('CodeModelProjectService', () => {
  let service: CodeModelProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
