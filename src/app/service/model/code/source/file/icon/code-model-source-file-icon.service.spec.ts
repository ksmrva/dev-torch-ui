import { TestBed } from '@angular/core/testing';
import { CodeModelSourceFileIconService } from './code-model-source-file-icon.service';

describe('CodeModelSourceFileIconService', () => {
  let service: CodeModelSourceFileIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelSourceFileIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
