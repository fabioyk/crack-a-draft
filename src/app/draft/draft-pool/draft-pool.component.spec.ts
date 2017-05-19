import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftPoolComponent } from './draft-pool.component';

describe('DraftPoolComponent', () => {
  let component: DraftPoolComponent;
  let fixture: ComponentFixture<DraftPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
