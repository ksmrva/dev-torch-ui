import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelSourceUrlNavOptionItemComponent } from './database-model-source-url-nav-option-item.component';

describe('DatabaseModelSourceUrlNavOptionItemComponent', () => {
  let component: DatabaseModelSourceUrlNavOptionItemComponent;
  let fixture: ComponentFixture<DatabaseModelSourceUrlNavOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceUrlNavOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceUrlNavOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
