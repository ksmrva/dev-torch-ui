import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal.service";

describe("ModalService", () => {
  let service: ModalService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService<any>);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
