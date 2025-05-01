import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatabaseDetailPreviewComponent } from './sql-database-detail-preview.component';

describe('SqlDatabaseDetailPreviewComponent', () => {
  let component: SqlDatabaseDetailPreviewComponent;
  let fixture: ComponentFixture<SqlDatabaseDetailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDatabaseDetailPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDatabaseDetailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
