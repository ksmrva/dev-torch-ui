import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatabaseDetailListEntryComponent } from './sql-database-detail-list-entry.component';

describe('SqlDatabaseDetailListEntryComponent', () => {
  let component: SqlDatabaseDetailListEntryComponent;
  let fixture: ComponentFixture<SqlDatabaseDetailListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDatabaseDetailListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDatabaseDetailListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
