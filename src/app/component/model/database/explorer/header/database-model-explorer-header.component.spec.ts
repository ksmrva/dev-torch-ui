import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelExplorerHeaderComponent } from './database-model-explorer-header.component';

describe('DatabaseModelExplorerHeaderComponent', () => {
  let component: DatabaseModelExplorerHeaderComponent;
  let fixture: ComponentFixture<DatabaseModelExplorerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelExplorerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelExplorerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
