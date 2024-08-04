import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../../services/data-sharing.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  screenH: number;
  screenW: number;

  language: string = "English";

  heading: string;
  deptName: string;
  mcName: string = "hi";
  jobIDLabel: string;
  partIDLabel: string;
  operationIDLabel: string;
  currentlyNoJob: string;
  start: string;
  end: string;
  getChart: string;
  oeeReport: string;
  availReport: string;
  whatIF: string;
  OEE: string;
  A: string;
  P: string;
  Q: string;
  producedQty: string;
  summary: string;
  totalHoursLabel: string;
  PDTLabel: string;
  runningLabel: string;
  stoppageLabel: string;
  setupLabel: string;
  brkdownLabel: string;
  availability_Modal: string;
  whatIfHeading: string;
  thPerson: string;
  thInitiatives: string;
  thGap: string;
  thLossType: string;
  thStatus: string;
  thLossReason: string;
  thLossHours: string;
  thTargetedHrs: string;
  thSavedHrs: string;
  thCostPerHr: string;
  thSavingPerDay: string;
  thSavingPerYr: string;
  thAmountInvested: string;
  thROI: string;
  thROIReturn: string;
  setupLossHrs: string;
  buttonCalculate: string;
  buttonReport: string;
  chinesereport: string;

  constructor(private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
    this.screenH = window.screen.height;
    this.screenW = window.screen.width;
    this.setLabels();
    //this.setDataToDataSharingService();
  }

  private isLanguageEnglish(): boolean {
    // Implement language logic here...
    return true; // Example implementation
  }
  // setDataToDataSharingService() {
  //   this.dataSharingService.setMcName(this.mcName); // 调用 DataSharingService 的方法将 mcName 存储到服务中
  //   this.dataSharingService.setDeptName(this.deptName);
  //   this.dataSharingService.setJobIDLabel(this.jobIDLabel);
  //   this.dataSharingService.setAvailReport(this.availReport);
  //   this.dataSharingService.setStart(this.start);
  //   this.dataSharingService.setEnd(this.end);
  //   this.dataSharingService.setOEE(this.OEE);
  //   this.dataSharingService.setOeeReport(this.oeeReport);
  //   this.dataSharingService.setWhatIF(this.whatIF);
  //   this.dataSharingService.setGetChart(this.getChart);
  //   this.dataSharingService.setChinesereport(this.chinesereport);
  // }



  private setLabels(): void {
    this.heading = this.isLanguageEnglish() ? "Machine OEE" : "Machine OEE";
    this.deptName = this.isLanguageEnglish() ? "Department Name" : "部门名称";
    this.mcName = this.isLanguageEnglish() ? "Machine Name" : "机器名称";
    this.jobIDLabel = this.isLanguageEnglish() ? "Job No" : "工单序号";
    this.partIDLabel = this.isLanguageEnglish() ? "Product Code" : "部件序号";
    this.operationIDLabel = this.isLanguageEnglish() ? "Outputs since" : "产量自从";
    this.currentlyNoJob = this.isLanguageEnglish() ? "Currently No Job is Running" : "没有正在进行的工单";
    this.start = this.isLanguageEnglish() ? "Enter Start Date" : "选择开始时间";
    this.end = this.isLanguageEnglish() ? "Enter End Date" : "选择结束时间";
    this.getChart = this.isLanguageEnglish() ? "Get Chart" : "确定";
    this.oeeReport = this.isLanguageEnglish() ? "OEE Report" : "OEE报告";
    this.availReport = this.isLanguageEnglish() ? "Availability Report" : "可用率报告";
    this.whatIF = this.isLanguageEnglish() ? "What If" : "假设分析";
    this.OEE = this.isLanguageEnglish() ? "OEE" : "OEE";
    this.A = this.isLanguageEnglish() ? "A" : "可用率";
    this.P = this.isLanguageEnglish() ? "P" : "表现指数";
    this.Q = this.isLanguageEnglish() ? "Q" : "质量指数";
    this.producedQty = this.isLanguageEnglish() ? "Total outputs" : "产量";
    this.summary = this.isLanguageEnglish() ? "Summary" : "总结";
    this.totalHoursLabel = this.isLanguageEnglish() ? "Total Hours" : "总小时";
    this.PDTLabel = this.isLanguageEnglish() ? "Planned Down Time" : "计划停机时间";
    this.runningLabel = this.isLanguageEnglish() ? "Running" : "机器运行";
    this.stoppageLabel = this.isLanguageEnglish() ? "Stoppage" : "停机";
    this.setupLabel = this.isLanguageEnglish() ? "Setup" : "设置";
    this.brkdownLabel = this.isLanguageEnglish() ? "Breakdown" : "机器故障";
    this.availability_Modal = this.isLanguageEnglish() ? "Availability" : "可用率";
    this.whatIfHeading = this.isLanguageEnglish() ? "What If" : "假设分析";
    this.thPerson = this.isLanguageEnglish() ? "Person-In-Charge" : "负责人";
    this.thInitiatives = this.isLanguageEnglish() ? "Initiatives & Activities" : "倡议和行动";
    this.thGap = this.isLanguageEnglish() ? "Gap to Address" : "要解决的差距";
    this.thLossType = this.isLanguageEnglish() ? "Loss Type" : "损失类别";
    this.thStatus = this.isLanguageEnglish() ? "Status" : "状态";
    this.thLossReason = this.isLanguageEnglish() ? "Loss Reason" : "损失原因";
    this.thLossHours = this.isLanguageEnglish() ? "Loss Hrs" : "损失总小时";
    this.thTargetedHrs = this.isLanguageEnglish() ? "Targeted Hrs" : "目标";
    this.thSavedHrs = this.isLanguageEnglish() ? "Saved Hrs" : "节省了(小时)";
    this.thCostPerHr = this.isLanguageEnglish() ? "Cost per Hour ($)" : "每小时费用($)";
    this.thSavingPerDay = this.isLanguageEnglish() ? "Saving per Day ($)" : "每天节省($)";
    this.thSavingPerYr = this.isLanguageEnglish() ? "Saving per Year ($)" : "每年节省($)";
    this.thAmountInvested = this.isLanguageEnglish() ? "Amount Invested ($)" : "投资金额($)";
    this.thROI = this.isLanguageEnglish() ? "ROI (%)" : "投资回报率(%)";
    this.thROIReturn = this.isLanguageEnglish() ? "ROI Return Days (Days)" : "回本期(天)";
    this.setupLossHrs = this.isLanguageEnglish() ? "SpeedLoss(Hrs)" : "速度损失(小时)";
    this.buttonCalculate = this.isLanguageEnglish() ? "Calculate" : "计算";
    this.buttonReport = this.isLanguageEnglish() ? "Report" : "生成报告";
    this.chinesereport = this.isLanguageEnglish() ? "中文OEE报告" : "中文OEE报告";
  }

   watchLanguageChange() {
    console.log('Individual Machine Dashboard screen, Language of preference changed to ' + this.language);
    this.setLabels();
  }


  switchToEnglish() {
    this.language = "English";
    localStorage.setItem('languageSelection', this.language);
    console.log("Switching language to English");
    this.watchLanguageChange();
  }

  switchToChinese() {
    this.language = "Chinese";
    localStorage.setItem('languageSelection', this.language);
    console.log("Switching language to Chinese");
    this.watchLanguageChange();
  }

  formdata = { english: true };
  OEEReportButtonName = "OEE Report";
  
  // 报错
  //localStorage.setItem('weekDaySelection', 'true');
//by default set it to true
//   localStorage.setItem('weekDaySelection', true);

// this.english = function () {
//    console.log("English: " + $scope.formdata.english);  //UnCheck All Rows check box   	      
//  localStorage.setItem('languageSelection', $scope.formdata.english);
// console.log("setting into localstorage: " +  $scope.formdata.english);
// }

// $scope.chinese = function () {
//    console.log("English: " + $scope.formdata.english);  //UnCheck All Rows check box  
//    console.log("Chinese: " + $scope.formdata.english);  //UnCheck All Rows check box        				
//  localStorage.setItem('languageSelection', $scope.formdata.english);
//  console.log("setting into localstorage: " +  $scope.formdata.english);
    
}
