import { TestBed } from "@angular/core/testing";
import { DbModelService } from "./db-model.service";

describe("DbModelService", () => {
  let service: DbModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbModelService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
