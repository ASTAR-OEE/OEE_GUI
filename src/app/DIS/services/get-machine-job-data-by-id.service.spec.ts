import { TestBed } from '@angular/core/testing';

import { GetMachineJobDataByIdService } from './get-machine-job-data-by-id.service';

describe('GetMachineJobDataByIdService', () => {
  let service: GetMachineJobDataByIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMachineJobDataByIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
