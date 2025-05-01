import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerPanelListComponent } from './explorer-panel-list.component';

describe('ExplorerPanelListComponent', () => {
  let component: ExplorerPanelListComponent;
  let fixture: ComponentFixture<ExplorerPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerPanelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorerPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
