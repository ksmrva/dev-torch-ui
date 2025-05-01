import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainModelExplorerComponent } from './domain-model-explorer.component';

describe('DomainModelExplorerComponent', () => {
  let component: DomainModelExplorerComponent;
  let fixture: ComponentFixture<DomainModelExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainModelExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainModelExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
