import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModelDetailNavOptionGroupComponent } from './database-model-detail-nav-option-group.component';

describe('DatabaseModelDetailNavOptionGroupComponent', () => {
  let component: DatabaseModelDetailNavOptionGroupComponent;
  let fixture: ComponentFixture<DatabaseModelDetailNavOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelDetailNavOptionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseModelDetailNavOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
