import { TestBed } from "@angular/core/testing";
import { DevTorchRootComponent } from "./dev-torch-root.component";

describe("DevTorchRootComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTorchRootComponent]
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(DevTorchRootComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
