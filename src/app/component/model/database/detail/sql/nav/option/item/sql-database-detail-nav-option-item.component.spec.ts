import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatabaseDetailNavOptionItemComponent } from './sql-database-detail-nav-option-item.component';

describe('SqlDatabaseDetailNavOptionItemComponent', () => {
  let component: SqlDatabaseDetailNavOptionItemComponent;
  let fixture: ComponentFixture<SqlDatabaseDetailNavOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDatabaseDetailNavOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDatabaseDetailNavOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
