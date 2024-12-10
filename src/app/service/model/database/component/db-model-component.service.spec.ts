import { TestBed } from "@angular/core/testing";
import { DbModelComponentService } from "./db-model-component.service";

describe("DbModelComponentService", () => {
  let service: DbModelComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbModelComponentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
