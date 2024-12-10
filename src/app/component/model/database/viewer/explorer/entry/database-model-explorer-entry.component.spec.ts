import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelExplorerEntryComponent } from './database-model-explorer-entry.component';

describe('DatabaseModelExplorerEntryComponent', () => {
  let component: DatabaseModelExplorerEntryComponent;
  let fixture: ComponentFixture<DatabaseModelExplorerEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelExplorerEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelExplorerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
