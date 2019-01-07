import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleImgComponent } from './simple-img.component';

describe('SimpleImgComponent', () => {
  let component: SimpleImgComponent;
  let fixture: ComponentFixture<SimpleImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
