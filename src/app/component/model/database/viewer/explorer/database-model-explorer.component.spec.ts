import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelExplorerComponent } from './database-model-explorer.component';

describe('DatabaseModelExplorerComponent', () => {
  let component: DatabaseModelExplorerComponent;
  let fixture: ComponentFixture<DatabaseModelExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
