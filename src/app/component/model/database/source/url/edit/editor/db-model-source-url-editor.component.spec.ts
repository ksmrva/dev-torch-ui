import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbModelSourceUrlEditorComponent } from './db-model-source-url-editor.component';

describe('DbModelSourceUrlEditorComponent', () => {
  let component: DbModelSourceUrlEditorComponent;
  let fixture: ComponentFixture<DbModelSourceUrlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceUrlEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbModelSourceUrlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
