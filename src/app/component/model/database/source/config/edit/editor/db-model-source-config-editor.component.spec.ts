import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbModelSourceConfigEditorComponent } from './db-model-source-config-editor.component';

describe('DbModelSourceConfigEditorComponent', () => {
  let component: DbModelSourceConfigEditorComponent;
  let fixture: ComponentFixture<DbModelSourceConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceConfigEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbModelSourceConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
