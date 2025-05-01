import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlTableDetailListEntryComponent } from './sql-table-detail-list-entry.component';

describe('SqlTableDetailListEntryComponent', () => {
  let component: SqlTableDetailListEntryComponent;
  let fixture: ComponentFixture<SqlTableDetailListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableDetailListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlTableDetailListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
