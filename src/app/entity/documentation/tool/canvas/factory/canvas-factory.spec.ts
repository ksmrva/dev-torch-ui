import { CanvasFactory } from "./canvas-factory";

describe("CanvasFactory", () => {
  it("should create an instance", () => {
    expect(new CanvasFactory()).toBeTruthy();
  });
});
