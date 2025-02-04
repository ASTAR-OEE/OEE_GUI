import { Component, OnInit } from '@angular/core';
import { MachineStatusService } from '../../services/machine-status.service';
import * as c3 from 'c3';
import * as d3 from 'd3';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-oee-report-withID',
  templateUrl: './oee-report-withID.component.html',
  styleUrls: ['./oee-report-withID.component.scss']
})
export class OEEReportWithIDComponent implements OnInit {
  MachineName: string;
  MachineId:string;
  startDate:string;
  endDate:string;
  From: string;
  To: string;
  SPT: number;
  NAT: string;
  PDT: number;
  Qty: number;
  SQty: number;

  AVAData: any[] = [];
  QTYData: any[] = [];
  jobData: any[] = [];
  shiftData: any[] = [];

  totalA: string;
  SetupSpeed: number;
  totalIOT: number;
  speedLoss: number;
  EfficiencyLoss: number;
  filteredJobData: any[] = [];

  currentDate: string;

  constructor(private machineStatusService: MachineStatusService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log("oee-report");
    this.loadData();
    this.setCurrentDate();
  }

  setCurrentDate() {
    this.currentDate = new Date().toLocaleString();
  }
  
  filterJobData(data: any[]): any[] {
    // 在这里实现过滤逻辑
    return data.filter(item => item.LOT !== null && item.LOT !== 0);
  }

  loadData() {
    // 假设 timerange 和 selectedDate 是你需要的参数
    //const timerange = 'Weekly'; // 根据实际需要设定
    //const selectedDate = new Date().toISOString(); // 替换为实际选择的日期
    this.route.params.subscribe(params => {
      this.MachineId = params['machineId']; // 使用+将字符串转换为数字
      this.startDate = params['startdate'];
      this.endDate = params['enddate'];
    });
    ///:machineId/:startdate/:enddate
    //console.log(this.MachineId,this.startDate, this.endDate);
    this.machineStatusService.getReportData2(this.MachineId,this.startDate, this.endDate).subscribe(
      data => {
          console.log(data.availability_loss_details);
          // 从数据中提取值并赋值给组件变量
          const kpiReport = data.kpi_report;
          const availabilityLossDetails = data.availability_loss_details;
          const jobDetails = data.job_details;
          const shiftDetails = data.shift_details;
          const OEEarray = [];
        
          let valueToPush = [];
          valueToPush[0] = 'Availability';
          valueToPush[1] = (kpiReport.A * 100).toFixed(2);
          OEEarray.push(valueToPush);
  
          valueToPush = [];
          valueToPush[0] = 'Performance';
          valueToPush[1] = (kpiReport.P * 100).toFixed(2);
          OEEarray.push(valueToPush);
  
          valueToPush = [];
          valueToPush[0] = 'Quality';
          valueToPush[1] = (kpiReport.Q * 100).toFixed(2);
          OEEarray.push(valueToPush);
  
          valueToPush = [];
          valueToPush[0] = 'OEE';
          valueToPush[1] = (kpiReport.OEE * 100).toFixed(2);
          OEEarray.push(valueToPush);
  
          // 生成图表
          this.generateOEEChart(OEEarray);

           // Process Table3 data
           const AVAarray = this.buildArrayFromTable(availabilityLossDetails, 'reason', 'duration_minutes');

           // Process Table7 data
           //const QTYarray = this.buildArrayFromTable(data.Table7, 'reason', 'Qty');
 
           // Generate pie charts
           const statusSums = new Map<string, number>();
           AVAarray.forEach(([status, value]) => {
            if (statusSums.has(status)) {
              statusSums.set(status, statusSums.get(status)! + value);
            } else {
              statusSums.set(status, value);
            }
          });
          const totalSum = Array.from(statusSums.values()).reduce((acc, sum) => acc + sum, 0);
          const resultArray = Array.from(statusSums.entries()).map(([status, sum]) => [status, (sum / totalSum) * 100]);
           this.reportPie('AVAPie', resultArray);
           //this.reportPie('QTYChart', QTYarray);
          
          // 填充基本变量
          this.MachineName = kpiReport.machine_name;
          this.SPT = kpiReport.total_production_time;
          this.NAT = kpiReport.net_available_time;// (data.Table[0].NAT / 3600).toFixed(2)
          this.PDT = kpiReport.planned_downtime;
          this.Qty = kpiReport.total_qty_produced;
          this.SQty = kpiReport.scrap_qty;
          this.From = kpiReport.startdt;
          this.To = kpiReport.enddt;
          // 处理和填充数据数组
          type DataObject = {
            machine_id: string;
            loss_type: string;
            reason: string;
            reason_code_c: string;
            chinese_code: string;
            start_time: string;
            end_time: string;
            duration_minutes: number;
            percentage: number;
          };
          const reasonMap = new Map<string, DataObject>();
          availabilityLossDetails.forEach(item => {
            if (reasonMap.has(item.reason)) {
              const existingItem = reasonMap.get(item.reason)!;
              existingItem.duration_minutes += item.duration_minutes;
            } else {
              // 克隆对象，保持其他属性不变，修改duration_minutes
              const newItem = { ...item, duration_minutes: item.duration_minutes };
              reasonMap.set(item.reason, newItem);
            }
          });
          const totalDuration = Array.from(reasonMap.values()).reduce((acc, item) => acc + item.duration_minutes, 0);
          const resultavailabilityLossDetails: DataObject[] = Array.from(reasonMap.values()).map(item => ({
            ...item,
            duration_minutes: parseFloat(item.duration_minutes.toFixed(2)),
            percentage: totalDuration > 0 ? parseFloat(((item.duration_minutes / totalDuration) * 100).toFixed(2)) : 0
          }));
          this.AVAData = resultavailabilityLossDetails;
          this.QTYData = shiftDetails;
          this.jobData = jobDetails;
          console.log(shiftDetails)
          this.shiftData = shiftDetails;
          console.log(this.AVAData);
          // 计算其他变量
          this.totalA = (kpiReport.unplanned_downtime/3600).toFixed(2);
          this.SetupSpeed = kpiReport.SETUP;
          this.totalIOT = kpiReport.ideal_operation_time;
          this.speedLoss = kpiReport.speedloss;
          this.EfficiencyLoss = kpiReport.efficiencyloss;

          const PERarray = [
            ['Actual Machine Time', (kpiReport.OPE / 3600).toFixed(2)],
            ['Ideal Machine Time', ((this.totalIOT) / 3600).toFixed(2)]
          ];
    
          this.reportbarPer('PERBar', PERarray);

          // 过滤 jobData 数据
          //this.filteredJobData = this.filterJobData(this.jobData);
        }
    );
  }

  // 方法用来生成图表
generateOEEChart(OEEarray: any[]) {
  const chart = c3.generate({
    bindto: '#OEEbar',
    size: {
      height: 200,
      width: 400
    },
    data: {
      columns: OEEarray,
      type: 'bar',
      labels: true
    },
    axis: {
      rotated: false
    },
    legend: {
      show: true
    },
    y: {
      max: 1.5,
      padding: {
        top: 50, bottom: 0
      },
      tick: {
        format: d3.format("%"),
        values: [.25, .5, .75, 1, 1.25, 1.5],
        count: 6
      },
      bar: {
        width: {
          ratio: 0.8 // 使条形图宽度为间距的80%
        }
      }
    }
  });
}

reportPie(chartId: string, array: any[]): void {
  c3.generate({
    bindto: `#${chartId}`,
    size: {
      height: this.getPieWidth(array),
    },
    data: {
      columns: array,
      type: 'pie',
      labels: true
    },
    legend: {
      // 位置不设置时，默认为右侧
    },
    padding: {
      top: 5
    }
  });
}

reportbarPer(chart: string, array: any[]): void {
  c3.generate({
    bindto: `#${chart}`,
    size: {
      height: 250,
      width: 300
    },
    data: {
      columns: array,
      type: 'bar',
      labels: true
    },
    axis: {
      rotated: true,
      x: { show: false },
      y: {
        label: 'Hours'
      }
    },
    legend: {
      show: true
    },
    bar: {
      width: 20
    }
  });
}

buildArrayFromTable(data: any[], labelKey: string, valueKey: string): any[] {
  return data.map(item => [item[labelKey], (item[valueKey]*60)]);
}

getPieWidth(array){
  if (array.length < 3) //legend has less than 15
      return 200;
  else if (array.length >= 3 && array.length < 8) //legend has less than 15
    return 250;
  else if (array.length >= 8 && array.length < 15) //legend has less than 15
    return 290;
  else  if(array.length >= 15 &&  array.length < 20)
    return 350;
  else 
    return 630;
}
}
