import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTextPropComponent } from './simple-text-prop.component';

describe('SimpleTextPropComponent', () => {
  let component: SimpleTextPropComponent;
  let fixture: ComponentFixture<SimpleTextPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTextPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
