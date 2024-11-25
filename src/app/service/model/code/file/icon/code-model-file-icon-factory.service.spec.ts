import { TestBed } from '@angular/core/testing';
import { CodeModelFileIconService } from './code-model-file-icon-factory.service';

describe('CodeModelFileIconService', () => {
  let service: CodeModelFileIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeModelFileIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
