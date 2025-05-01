import { TestBed } from '@angular/core/testing';

import { ExplorerPanelListService } from './explorer-panel-list.service';

describe('ExplorerPanelListService', () => {
  let service: ExplorerPanelListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorerPanelListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
