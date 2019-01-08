import { ObjsHostDirective } from './objs-host.directive';
import { TestBed } from '@angular/core/testing';

describe('ObjsHostDirective', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const directive: ObjsHostDirective = TestBed.get(ObjsHostDirective);
    expect(directive).toBeTruthy();
  });
});
