import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTorchRootHeaderComponent } from './dev-torch-root-header.component';

describe('DevTorchRootHeaderComponent', () => {
  let component: DevTorchRootHeaderComponent;
  let fixture: ComponentFixture<DevTorchRootHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTorchRootHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTorchRootHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
