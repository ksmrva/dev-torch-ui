import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasEditModalComponent } from './canvas-edit-modal.component';

describe('CanvasCreateModalComponent', () => {
  let component: CanvasEditModalComponent;
  let fixture: ComponentFixture<CanvasEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
