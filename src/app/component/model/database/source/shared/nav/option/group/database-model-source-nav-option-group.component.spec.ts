import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelSourceNavOptionGroupComponent } from './database-model-source-nav-option-group.component';

describe('DatabaseModelSourceNavOptionGroupComponent', () => {
  let component: DatabaseModelSourceNavOptionGroupComponent;
  let fixture: ComponentFixture<DatabaseModelSourceNavOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceNavOptionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceNavOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
