import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjPropComponent } from './obj-prop.component';

describe('ObjPropComponent', () => {
  let component: ObjPropComponent;
  let fixture: ComponentFixture<ObjPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
