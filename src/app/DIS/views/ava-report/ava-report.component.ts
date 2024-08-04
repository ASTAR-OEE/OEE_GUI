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
          
          this.AVAData = data.availability_loss_details;

           // Process Table3 data
           //const AVAarray= this.buildArrayFromTable(this.AVAData, 'reason', 'duration_minutes');

        }
        
    );
  }


}
