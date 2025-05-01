import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelSourceUrlEditModalComponent } from './database-model-source-url-edit-modal.component';

describe('DatabaseModelSourceUrlEditModalComponent', () => {
  let component: DatabaseModelSourceUrlEditModalComponent;
  let fixture: ComponentFixture<DatabaseModelSourceUrlEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceUrlEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceUrlEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
