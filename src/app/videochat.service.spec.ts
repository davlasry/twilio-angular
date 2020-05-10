import { TestBed } from '@angular/core/testing';

import { VideochatService } from './videochat.service';

describe('VideochatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideochatService = TestBed.get(VideochatService);
    expect(service).toBeTruthy();
  });
});
