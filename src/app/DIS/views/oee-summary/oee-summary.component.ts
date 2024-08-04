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
        this.chartData = data.kpi_results;
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
    this.router.navigate(['/oee-report',this.selectedDate,this.timerange]); // 跳转到 OEE 报告页面
   
  }
}

