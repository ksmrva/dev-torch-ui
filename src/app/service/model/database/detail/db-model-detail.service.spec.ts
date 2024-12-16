import { TestBed } from "@angular/core/testing";
import { DatabaseModelDetailService } from "./db-model-detail.service";

describe("DatabaseModelDetailService", () => {
  let service: DatabaseModelDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseModelDetailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
