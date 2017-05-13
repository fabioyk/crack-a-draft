import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatChooserComponent } from './format-chooser.component';

describe('FormatChooserComponent', () => {
  let component: FormatChooserComponent;
  let fixture: ComponentFixture<FormatChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
