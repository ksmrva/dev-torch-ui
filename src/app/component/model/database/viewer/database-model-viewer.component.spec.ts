import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelViewerComponent } from './database-model-viewer.component';

describe('DatabaseModelViewerComponent', () => {
  let component: DatabaseModelViewerComponent;
  let fixture: ComponentFixture<DatabaseModelViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
