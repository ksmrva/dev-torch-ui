import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbColumnEditModalComponent } from "./db-column-edit-modal.component";

describe("DbColumnEditModalComponent", () => {
  let component: DbColumnEditModalComponent;
  let fixture: ComponentFixture<DbColumnEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbColumnEditModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbColumnEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
