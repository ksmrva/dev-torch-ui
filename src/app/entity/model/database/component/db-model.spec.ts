import { DbModel } from "./db-model";

describe("DbModel", () => {
  it("should create an instance", () => {
    expect(new DbModel()).toBeTruthy();
  });
});
