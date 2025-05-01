import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainModelExplorerHeaderComponent } from './domain-model-explorer-header.component';

describe('DomainModelExplorerHeaderComponent', () => {
  let component: DomainModelExplorerHeaderComponent;
  let fixture: ComponentFixture<DomainModelExplorerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainModelExplorerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainModelExplorerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
