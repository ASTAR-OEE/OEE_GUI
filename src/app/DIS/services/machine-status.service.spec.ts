import { TestBed } from '@angular/core/testing';

import { MachineStatusService } from './machine-status.service';

describe('MachineStatusService', () => {
  let service: MachineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
