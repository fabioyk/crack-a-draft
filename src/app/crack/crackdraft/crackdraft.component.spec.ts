import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrackdraftComponent } from './crackdraft.component';

describe('CrackdraftComponent', () => {
  let component: CrackdraftComponent;
  let fixture: ComponentFixture<CrackdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrackdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrackdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
