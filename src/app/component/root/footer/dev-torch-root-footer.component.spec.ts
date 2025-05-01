import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTorchRootFooterComponent } from './dev-torch-root-footer.component';

describe('DevTorchRootFooterComponent', () => {
  let component: DevTorchRootFooterComponent;
  let fixture: ComponentFixture<DevTorchRootFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTorchRootFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTorchRootFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
