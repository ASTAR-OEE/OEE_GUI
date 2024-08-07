import { Component, OnInit} from '@angular/core';
import { MachineStatusService } from '../../services/machine-status.service';
import { Router } from '@angular/router'; 

// import { DepartmentService } from '../department.service';
import * as c3 from 'c3';
import * as d3 from 'd3';

@Component({
  selector: 'app-oee-summary',
  templateUrl: './oee-summary.component.html',
  styleUrls: ['./oee-summary.component.scss']
})
export class OeeSummaryComponent implements OnInit {
  chartH: number;
  chartW: number;
  typeInput: number = 1; // should be 1 to get OEE, A, P, Q values
  chartData: any;
  names: any[] = [];
  defaultDeptName: string = '';
  defaultDeptID: number = 0;
  //type: number = 117;
  selectBoxData: any;
  selectedDepartmentName: string = '';
  selectedDate = '';
  minDate: Date = new Date();
  timerange='';

  constructor(
    private machineStatusService: MachineStatusService,
    private router: Router
    // private departmentService: DepartmentService
  ) { }



  onDateSelect() {
    this.minDate = new Date(); 
    console.log('Selected date:', this.selectedDate);
  }

  ngOnInit() {
    this.chartH = window.innerHeight * 0.8;
    this.chartW = window.innerWidth * 0.2;
    this.someStuff("Weekly",this.selectedDate);
    // this.departmentService.getDepartmentNames().subscribe(
    //   data => {
    //     this.selectBoxData = {
    //       availableOptions: data,
    //       selectedOption: data[0] // This sets the default value of the select in the UI
    //     };
    //     this.selectedDepartmentName = data[0].D_Name;
    //     this.defaultDeptName = data[1].D_Name;
    //     this.defaultDeptID = data[1].D_Id;

    //     this.someStuff(this.defaultDeptID, this.type, null, null);
    //   },
    //   error => {
    //     console.log("error in getDepartmentNames WS");
    //   }
    // );
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
    this.someStuff(value,this.selectedDate);
  }

  // onDepartmentSelect() {
  //   this.selectedDepartmentName = this.selectBoxData.selectedOption.D_Name;
  //   this.someStuff(this.selectBoxData.selectedOption.D_Id, this.type, null, null);
  // }

  someStuff(timerange: string,startdate:string) {
    this.machineStatusService.getAPQPercentage_Time(timerange,startdate).subscribe(
      data => {
        console.log(data)
        const kpiList = data.kpi_reports;
        const KL = [];
        const ans = [];
        for (let i = 0; i < kpiList.length; i++) {
          if (!KL.includes(kpiList[i].machine_name)) {
            KL.push(kpiList[i].machine_name);
            ans.push({
              "machine_id": kpiList[i].machine_id,
              "MachineName": kpiList[i].machine_name,
              "A": kpiList[i].A,
              "P": kpiList[i].P,
              "Q": kpiList[i].Q,
              "OEE": kpiList[i].OEE,
              "startdt": kpiList[i].startdt,
              "enddt": kpiList[i].enddt
            });
          }
        }
        // this.chartData = data.kpi_reports;
        this.chartData = ans;
        console.log(this.chartData);
        this.generateCharts();
      },
      error => {
        console.log("web service error");
      }
    );
  }

  generateCharts() {
    this.generateChart('#chartOne', 'A', '#1f77b4', 0.65);
    this.generateChart('#chartTwo', 'P', '#20D3F9', 0.9);
    this.generateChart('#chartThree', 'Q', '#079206', 0.95);
    this.generateChart('#chartFour', 'OEE', '#CEBF2E', 0.65);
  }

  generateChart(bindTo: string, value: string, color: string, lineValue: number) {
    c3.generate({
      bindto: bindTo,
      size: {
        height: this.chartH,
        width: this.chartW
      },
      data: {
        json: this.chartData,
        // [ { "machine_id": "10.40.0.231", "MachineName": "M 1", "A": 0.8306666666666667, "P": 0.819, "Q": 0.906, "OEE": 0.6166666666666667, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-07-05T08:04:24.870000" }, 
        // {  "machine_id": "10.40.0.232", "MachineName": "M 2", "A": 0.8085, "P": 0.8245, "Q": 0.9135, "OEE": 0.609, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-07-04T09:04:50.747000" }, 
        // { "machine_id": "10.40.0.233", "MachineName": "M 3", "A": 0.8235, "P": 0.826, "Q": 0.898, "OEE": 0.6114999999999999, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-07-04T09:04:50.747000" }, 
        // { "machine_id": "10.40.0.234", "MachineName": "M 4", "A": 0.822, "P": 0.823, "Q": 0.903, "OEE": 0.611, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-06-02T07:15:55.717000" }, 
        // { "machine_id": "10.40.0.235", "MachineName": "M 5", "A": 0.815, "P": 0.819, "Q": 0.902, "OEE": 0.602, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-06-02T07:15:55.717000" }, 
        // { "machine_id": "10.40.0.236", "MachineName": "M 6", "A": 0.862, "P": 0.817, "Q": 0.919, "OEE": 0.647, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-06-02T07:15:55.717000" }, 
        // { "machine_id": "10.40.0.237", "MachineName": "M 7", "A": 0.754, "P": 0.828, "Q": 0.913, "OEE": 0.57, "startdt": "2024-06-01T07:15:55.717000", "enddt": "2024-06-02T07:15:55.717000" } ] ,
        keys: {
          x: 'MachineName',
          value: [value],
        },
        type: 'bar',
        colors: {
          [value]: color
        },
      },
      axis: {
        rotated: true,
        x: {
          type: 'category',
        },
        y: {
          max: 1.1,
          padding: {
            top: 150, bottom: 0
          },
          tick: {
            format: d3.format(".2%"),
            values: [.5, 1],
            count: 3
          },
        },
      },
      grid: {
        y: {
          lines: [
            { value: lineValue, class: 'grid800', text: `${lineValue * 100}%` }
          ]
        }
      },
      bar: {
        width: {
          ratio: 0.5// this makes bar width 50% of length between ticks
        }
      }
    });
  }

  navigateToOeeReport() {
    let time = this.timerange
    if (time == 'Weekly') {
      time = 'past_week'
    } else if (time == 'Monthly') {
      time = 'past_month'
    } else if (time == '3-Monthly') {
      time = 'last_3_months'
    } else if (time == '6-Monthly') {
      time = 'last_6_months'
    } else if (time == '12-Monthly') {
      time = 'last_12_months'
    }
    const date = new Date(this.selectedDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 月份从 0 开始
    const day = String(date.getUTCDate()).padStart(2, '0');
    const isoDateString = `${year}-${month}-${day}T00:00:00Z`;
    console.log(isoDateString, time)
    this.router.navigate(['/oee-report',isoDateString,time]); // 跳转到 OEE 报告页面
   
  }
}

