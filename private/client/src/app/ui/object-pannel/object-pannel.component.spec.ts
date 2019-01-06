import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectPannelComponent } from './object-pannel.component';

describe('ObjectPannelComponent', () => {
  let component: ObjectPannelComponent;
  let fixture: ComponentFixture<ObjectPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
