import { TestBed } from "@angular/core/testing";
import { BaseApiService } from "./base.api.service";

describe('BaseService', () => {
  let service: BaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
