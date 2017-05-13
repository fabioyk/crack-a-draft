import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftStatsComponent } from './draft-stats.component';

describe('DraftStatsComponent', () => {
  let component: DraftStatsComponent;
  let fixture: ComponentFixture<DraftStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
