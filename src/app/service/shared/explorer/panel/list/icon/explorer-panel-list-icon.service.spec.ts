import { TestBed } from '@angular/core/testing';

import { ExplorerPanelListIconService } from './explorer-panel-list-icon.service';

describe('ExplorerPanelListIconService', () => {
  let service: ExplorerPanelListIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorerPanelListIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
