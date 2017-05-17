import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftSearchComponent } from './draft-search.component';

describe('DraftSearchComponent', () => {
  let component: DraftSearchComponent;
  let fixture: ComponentFixture<DraftSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
