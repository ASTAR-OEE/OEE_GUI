import { Component, OnInit } from '@angular/core';
import { MachineStatusService } from '../../services/machine-status.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ava-report',
  templateUrl: './ava-report.component.html',
  styleUrls: ['./ava-report.component.scss']
})
export class AvaReportComponent {

  MachineName: string;
  From: string;
  To: string;

  currentDate: string;
  MachineId:string;
  startDate:string;
  endDate:string;

  AVAData: any[] = [];

  constructor(private machineStatusService: MachineStatusService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log("oee-report");
    this.loadData();
    this.setCurrentDate();
  }

  setCurrentDate() {
    this.currentDate = new Date().toLocaleString();
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
          console.log(data);
          // 从数据中提取值并赋值给组件变量
          this.MachineName = data.kpi_report.machine_name;
          this.From =  data.kpi_report.startdt;
          this.To =  data.kpi_report.enddt;
          
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
          data.availability_loss_details.forEach(item => {
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

           // Process Table3 data
           //const AVAarray= this.buildArrayFromTable(this.AVAData, 'reason', 'duration_minutes');

        }
        
    );
  }


}
