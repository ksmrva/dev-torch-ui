import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatabaseDetailEditModalComponent } from './sql-database-detail-edit-modal.component';

describe('SqlDatabaseDetailEditModalComponent', () => {
  let component: SqlDatabaseDetailEditModalComponent;
  let fixture: ComponentFixture<SqlDatabaseDetailEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDatabaseDetailEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDatabaseDetailEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
