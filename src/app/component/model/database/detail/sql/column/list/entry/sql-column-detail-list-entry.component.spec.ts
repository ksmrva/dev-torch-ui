import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlColumnDetailListEntryComponent } from './sql-column-detail-list-entry.component';

describe('SqlColumnDetailListEntryComponent', () => {
  let component: SqlColumnDetailListEntryComponent;
  let fixture: ComponentFixture<SqlColumnDetailListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnDetailListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlColumnDetailListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
