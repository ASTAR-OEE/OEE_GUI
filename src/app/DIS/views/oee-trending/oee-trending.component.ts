import { Component, OnInit} from '@angular/core';
import { MachineStatusService } from '../../services/machine-status.service';

@Component({
  selector: 'app-oee-trending',
  templateUrl: './oee-trending.component.html',
  styleUrls: ['./oee-trending.component.scss']
})
export class OeeTrendingComponent {
  screenH: number;
  screenW: number;
  timerange='';

  selectBoxData = {
    availableOptions: [],
    selectedOption: null
  };

  constructor(
    private machineStatusService: MachineStatusService,
    // private departmentService: DepartmentService
  ) { }

  ngOnInit() {
    this.screenH = window.innerHeight;
    this.screenW = window.innerWidth;
    this.loadmachine();
  }

  getVal(active: any) {
    const value = active.currentTarget.value;
    // if (value === 'Weekly') this.type = 117;
    // if (value === 'Monthly') this.type = 140;
    // if (value === '3-Monthly') this.type = 145;
    // if (value === '6-Monthly') this.type = 149;
    // if (value === '12-Monthly') this.type = 151;
    //this.someStuff(this.selectBoxData.selectedOption.D_Id, this.type, null, null);
    console.log("getVal triggered with value:", value);
    this.timerange = value;
    //this.someStuff(value,this.selectedDate);
  }

  loadmachine(): void {
    this.machineStatusService.getAPQPercentage_Time("", "").subscribe(
      data => {
        console.log(data.kpi_results);
        this.selectBoxData.availableOptions = data.kpi_results.map(result => ({
          D_Name: result.MachineName,
          D_Id: result.id
        }));
      },
      error => {
        console.log("web service error");
      }
    );
  }
}
