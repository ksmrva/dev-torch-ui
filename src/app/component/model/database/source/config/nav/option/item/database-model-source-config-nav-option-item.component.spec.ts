import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelSourceConfigNavOptionItemComponent } from './database-model-source-config-nav-option-item.component';

describe('DatabaseModelSourceConfigNavOptionItemComponent', () => {
  let component: DatabaseModelSourceConfigNavOptionItemComponent;
  let fixture: ComponentFixture<DatabaseModelSourceConfigNavOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceConfigNavOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceConfigNavOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
