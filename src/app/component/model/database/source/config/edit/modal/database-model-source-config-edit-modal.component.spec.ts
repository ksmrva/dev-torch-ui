import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelSourceConfigEditModalComponent } from './database-model-source-config-edit-modal.component';

describe('DatabaseModelSourceConfigEditModalComponent', () => {
  let component: DatabaseModelSourceConfigEditModalComponent;
  let fixture: ComponentFixture<DatabaseModelSourceConfigEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceConfigEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceConfigEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
