import { TestBed } from '@angular/core/testing';

import { ObjsService } from './objs.service';

describe('ObjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjsService = TestBed.get(ObjsService);
    expect(service).toBeTruthy();
  });
});
