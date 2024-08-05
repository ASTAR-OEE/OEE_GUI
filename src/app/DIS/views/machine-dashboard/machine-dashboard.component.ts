import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { GetMachineJobDataByIdService } from '../../services/get-machine-job-data-by-id.service';
import { DataSharingService } from '../../services/data-sharing.service';
//import * as moment from 'moment';
import * as c3 from 'c3';
import * as d3 from 'd3';
import * as moment from 'moment';

import { Router } from '@angular/router'; 

declare var Morris: any;

@Component({
  selector: 'app-machine-dashboard',
  templateUrl: './machine-dashboard.component.html',
  styleUrls: ['./machine-dashboard.component.scss'] // Assuming you have CSS file
})
export class MachineDashboardComponent implements OnInit {
  screenH: number;
  screenW: number;
  MachineID: string;
  MachineName: string;
  //mcName: string;
  status: string;
  //deptName: string;
  DepartmentName: string;
  statusStyle: string;
  JobId: string;
  //jobIDLabel: string;
  partID: string;
  operationID: string;
  infoMessage: string;
  showMessage: boolean;
  time: string; // Assuming time is a string


  //getChart: string;
  //oeeReport: string;
  //availReport: string;
  //whatIF: string;
  OEE: number;
  A:number;
  P:number;
  Q:number;
  //chinesereport: string;
  producedQty: string;

  currentDate: Data;
  totalQuantity: number;
  TotalWidth: number;
  ScrapQuantity: number;
  ScrapWidth: number;

  totalIOT: string;
  speedLoss:string;
  EfficiencyLoss:string;

  isOEEModalOpen = false;
  isPerModalOpen = false;

  setupLossToShow: string;
  A_new_value:number;
  P_new_value:number;
  Q_new_value:number;
  OEE_new_value:number;

  isMsgShow = false;
  breakdown: any;
  breakdownMsg: string;
  running: any;
  runningMsg: string;
  setup: any;
  setupMsg: string;
  stoppage: any;
  stoppageMsg: string;
  noschedule: any;
  noscheduleMsg: string;
  totalHours: string;

  selectedDate: string;
  maxDate: Date = new Date();
  startdate =  new Date('2024-08-01');
  enddate = new Date('2024-08-05');

  constructor(
    private route: ActivatedRoute,
    private getMachineJobDataByIDService: GetMachineJobDataByIdService,
    private dataSharingService: DataSharingService,
    private el: ElementRef,
    private router: Router
  ) {
    const params = this.route.snapshot.params;
    this.MachineID = params.MachineID;
    this.MachineName = params.MachineName;
    this.DepartmentName = params.DepartmentName;
    this.JobId = params.JobId;
    this.status = `${params.Reason} - ${params.Duration} Mins`;
    this.DepartmentName = params.DepartmentName;

    if (params.status) {
      switch (params.status.toUpperCase()) {
        case 'RUNNING':
          this.statusStyle = 'running';
          break;
        case 'BREAKDOWN':
          this.statusStyle = 'breakdown';
          break;
        case 'STOPPAGE':
          this.statusStyle = 'stoppage';
          break;
        case 'NO SCHEDULE':
          this.statusStyle = 'noSchedule';
          break;
        case 'SETUP':
          this.statusStyle = 'setup';
          break;
        default:
          this.statusStyle = 'default';
          break;
      }
    } else {
      this.statusStyle = 'default';
    }

    console.log(params.JobStatus,"   ",params.JobId);
    if (params.JobStatus === "End") {
      this.JobId = '';
      this.partID = '';
      this.operationID = '';
      this.infoMessage = 'Currently No Job is running.';
      this.showMessage = true;
    } else if (params.JobStatus === "Start") {
      this.JobId = params.JobId;
      this.partID = params.PartId;
      this.operationID = params.ProcessId;
      this.time = params.time;
      this.infoMessage = '';
      this.showMessage = false;
    } else {
      this.JobId = '';
      this.partID = '';
      this.operationID = '';
      this.infoMessage = 'Job data is not available in database.';
      this.showMessage = true;
    }
  }

  ngOnInit(): void {
    this.screenH = window.innerHeight;
    this.screenW = window.innerWidth;
    this.currentDate = new Date();
    // this.mcName = this.dataSharingService.getMcName();
    // this.deptName = this.dataSharingService.getDeptName();
    // this.jobIDLabel = this.dataSharingService.getJobIDLabel();

    // this.getChart = this.dataSharingService.getGetChart();
    // this.oeeReport = this.dataSharingService.getGetChart();
    // this.availReport = this.dataSharingService.getAvailReport();
    // this.whatIF = this.dataSharingService.getWhatIF();
    // //this.OEE = this.dataSharingService.getOEE();
    // this.chinesereport = this.dataSharingService.getChinesereport();

    this.show();
    
  }
  

  show():
  void{
    // this.startdate = (document.getElementById('datepickerStart') as HTMLInputElement).placeholder;
    // this.enddate = (document.getElementById('datepickerEnd') as HTMLInputElement).placeholder;
    // if(this.startdate === '' || this.enddate ===''){
    //   this.startdate = '2020-05-20';
    //   this.enddate =  '2024-06-20';
    // }

    this.dataSharingService.getStatus(this.MachineID, this.startdate, this.enddate).subscribe(
      (data) => {
        console.log(data);

        // Assuming data contains oee, ava, per, qua, and corresponding colors
        this.OEE = data.kpi_results.OEE*100;
        this.A = data.kpi_results.A*100;
        this.P = data.kpi_results.P*100;
        this.Q = data.kpi_results.Q*100;
        const oeecolor = 'rgb(226, 93, 93)';
        const avacolor = 'rgb(237, 206, 140)';
        const percolor = 'rgb(26, 188, 156)';
        const quacolor = 'rgb(246, 147, 139)';
        this.drawDonut(this.OEE, this.A, this.P, this.Q, oeecolor, avacolor, percolor, quacolor);
        this.generateOEEbar(this.OEE,this.A, this.P, this.Q);

        const PERarray = [];
        //Performance modal
        this.totalIOT = (data.kpi_results.IOT / 3600).toFixed(2)
        this.speedLoss = (data.kpi_results.speedloss / 3600).toFixed(2);
        this.EfficiencyLoss = (data.kpi_results.speedloss*100/data.kpi_results.OPE).toFixed(2);
        var x =  data.kpi_results.OPE / 3600;
        PERarray.push(['Actual Machine Time', x.toFixed(2)]);
        PERarray.push(['Ideal Machine Time',((data.kpi_results.IOT) / 3600).toFixed(2)]);
        this.reportbarPer('PERBar', PERarray);

        var target = data.kpi_results.TotalQuantity + 8;
        this.totalQuantity = data.kpi_results.TotalQuantity - data.kpi_results.ScrapQuantity;
        this.TotalWidth = data.kpi_results.TotalQuantity * 70 / target;
        this.ScrapQuantity = data.kpi_results.ScrapQuantity;
        this.ScrapWidth = data.kpi_results.ScrapQuantity * 70 / target;

          //---------------------Gauge--------------------------------
          //   $scope.drawGauge(item.Speed, item.SetupSpeed);
          //--------------------StatusBreakdown-----------------------  
          this.breakdown = data.kpi_results.BREAKDOWNper;
          this.breakdownMsg = (data.kpi_results.BREAKDOWN / 3600).toFixed(2) + " Hours     " + data.kpi_results.BREAKDOWNper.toFixed(2) + "%";  //divide by 60 * 60 ...gives Hours
          // $scope.breakdownMsg = Math.round(item.BREAKDOWN / 3600) + " Hours     " + item.BREAKDOWNper.toFixed(2) + "%";  //divide by 60 * 60 ...gives Hours
          this.running = data.kpi_results.OPEper;
          this.runningMsg = (data.kpi_results.OPE / 3600).toFixed(2) + " Hours    " + data.kpi_results.OPEper.toFixed(2) + "%";
          //  $scope.runningMsg = Math.round(item.OPE / 3600) + " Hours    " + item.OPEper.toFixed(2) + "%";
          this.setup = data.kpi_results.SETUPper;
          this.setupMsg = (data.kpi_results.SETUP / 3600).toFixed(2) + " Hours    " + data.kpi_results.SETUPper.toFixed(2) + "%";
          // $scope.setupMsg = Math.round(item.SETUP / 3600) + " Hours    " + item.SETUPper.toFixed(2) + "%";
          this.stoppage = data.kpi_results.STOPPAGEper;
          this.stoppageMsg = (data.kpi_results.STOPPAGE / 3600).toFixed(2) + " Hours    " + data.kpi_results.STOPPAGEper.toFixed(2) + "%";
          // $scope.stoppageMsg = Math.round(item.STOPPAGE / 3600) + " Hours    " + item.STOPPAGEper.toFixed(2) + "%";
          this.noschedule = data.kpi_results.NOSCHEDULEper;
          this.noscheduleMsg = (data.kpi_results.NOSCHEDULE / 3600).toFixed(2) + " Hours    " + data.kpi_results.NOSCHEDULEper.toFixed(2) + "%";
          // $scope.noscheduleMsg = Math.round(item.NOSCHEDULE / 3600) + " Hours    " + item.NOSCHEDULEper.toFixed(2) + "%";
          var totalHours = data.kpi_results.BREAKDOWN + data.kpi_results.OPE + data.kpi_results.SETUP + data.kpi_results.STOPPAGE + data.kpi_results.NOSCHEDULE;
          // $scope.totalHours = Math.round(totalHours / 3600) + " Hours";
          this.totalHours = (totalHours / 3600).toFixed(2)  + " Hours";

        var sumSetupLoss = 0;
        data.job_details.forEach((item) => {
          sumSetupLoss += item.setuploss;
        });                    
              //$scope.setupLossToShow = setupLoss / 60; //in hours...show this on whatif  screen
			  this.setupLossToShow = (sumSetupLoss / 60).toFixed(2);
        sumSetupLoss = sumSetupLoss / 60; 

        // 
        // var sumSavedHours_setup = 0;
        // if (sumSetupLoss - sumSavedHours_setup < 0) { //if its negative, then take it as zero
        //   UDT = totalTargetHrs_stoppageAndBreakdown;
        //   IOT = IOT + (sumSavedHours_setup - sumSetupLoss);  //new

        // }

        // this.A_new_value = 1 - (UDT / (SPT - PDT));
        // this.P_new_value = totalIOT_after / ((SPT - PDT) - UDT);
        // this.OEE_new_value = this.A_new_value * this.P_new_value * 1;
      },
      (error) => {
        console.error('Error fetching machine job data', error);
      }

     
    );

   
    this.dataSharingService.getTables(this.MachineID, this.startdate, this.enddate).subscribe(
      (data) => {
        if (data.Table4.length > 0) {              
                  //$('#noDataMsgBox').hide();
                 // var tasksstring = '[' + data.Table[0].JSONdata.toString() + ']';
                  
                 // var tasks = JSON.parse(tasksstring).concat(data.Table5);
                  // this.tasks = data.Table4;
                  // this.tasks = tasks;
                  //draw chart Function
                  var taskStatus = {
                    "Breakdown": "bar-breakdown",
                    "No Schedule": "bar-noSchedule",
                    "Running": "bar-running",
                    "Setup": "bar-setup",
                    "Stoppage": "bar-stoppage",
                    "Disconnected": "bar"
                  };
                var taskNames = ["Machine Status"];
                  this.drawGantt(data.Table4, taskStatus, taskNames, null, this.startdate, this.enddate);
              }
              else {
                  //$('#noDataMsgBox').show();
                  this.isMsgShow = true;
              }
              
              var task_Status = [];
              var task_Names = ["Jobs Completed","Job Ongoing"];
              var colorArr = [];
        // //------------JobGantt----------------    
        if (data.Table1.length > 0) {
          data.Table1.forEach((item) => {
            document.getElementById('noDataMsgBoxJob')!.style.display = 'none';
      
            if (!item.jobArr) {
              item.jobArr = [];
            }
          
            if ( item.jobArr.indexOf(item.Job) === -1) {
              item.jobArr.push(item.Job);
      
              item.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
              task_Status[item.Job] = 'bar-' + item.color.substring(1);
              colorArr.push(item.color);
            }
          });

          //draw chart           
          this.drawGanttForJobs(data.Table1, task_Status, task_Names, null, this.startdate, this.enddate, colorArr);
      }
      else
      {
          //$('#noDataMsgBoxJob').show();
          //$scope.noDataMsgJob = "There is no Job data for the selected period."
      }
      }
    );
  }
  drawDonut(oee: number, ava: number, per: number, qua: number, oeecolor: string, avacolor: string, percolor: string, quacolor: string): void {
    
    const oeeArray = [];
    const avaArray = [];
    const perArray = [];
    const quaArray = [];

    // OEE donut chart
    const obj1 = { value: oee, label: "OEE", formatted: `${Math.round(oee)}%` };
    oeeArray.push(obj1);
    const obj2 = { value: oee < 100 ? Math.round(100 - oee) : 0, label: "Losses", formatted: `${obj1.value}%` };
    oeeArray.push(obj2);

    // AVA donut chart
    const obj3 = { value: ava, label: "A", formatted: `${Math.round(ava)}%` };
    avaArray.push(obj3);
    const obj4 = { value: ava < 100 ? Math.round(100 - ava) : 0, label: "Losses", formatted: `${obj3.value}%` };
    avaArray.push(obj4);

    // PER donut chart
    const obj5 = { value: per, label: "P", formatted: `${Math.round(per)}%` };
    perArray.push(obj5);
    const obj6 = { value: per < 100 ? Math.round(100 - per) : 0, label: "Losses", formatted: `${obj5.value}%` };
    perArray.push(obj6);

    // QUA donut chart
    const obj7 = { value: qua, label: "Q", formatted: `${Math.round(qua)}%` };
    quaArray.push(obj7);
    const obj8 = { value: qua < 100 ? Math.round(100 - qua) : 0, label: "Losses", formatted: `${obj7.value}%` };
    quaArray.push(obj8);

    function clearDonutChart(elementId) {
      document.getElementById(elementId).innerHTML = '';
  }
  
  // 清空所有图表
  clearDonutChart('donutChartOEE');
  clearDonutChart('donutChartAVA');
  clearDonutChart('donutChartPER');
  clearDonutChart('donutChartQUA');

    // Draw OEE donut chart
    Morris.Donut({
      element: 'donutChartOEE',
      data: oeeArray,
      backgroundColor: '#fff',
      labelColor: oeecolor,
      colors: [oeecolor, '#999'],
      formatter: function (x, data) { return data.formatted; }
    });

    // Draw AVA donut chart
    Morris.Donut({
      element: 'donutChartAVA',
      data: avaArray,
      backgroundColor: '#fff',
      labelColor: avacolor,
      colors: [avacolor, '#999'],
      formatter: function (x, data) { return data.formatted; }
    });

    // Draw PER donut chart
    Morris.Donut({
      element: 'donutChartPER',
      data: perArray,
      backgroundColor: '#fff',
      labelColor: percolor,
      colors: [percolor, '#999'],
      formatter: function (x, data) { return data.formatted; }
    });

    // Draw QUA donut chart
    Morris.Donut({
      element: 'donutChartQUA',
      data: quaArray,
      backgroundColor: '#fff',
      labelColor: quacolor,
      colors: [quacolor, '#999'],
      formatter: function (x, data) { return data.formatted; }
    });
  }

   // 显示 OEE 模态框的方法
   oeeDonutClick(): void {
    console.log('OEE donut clicked');
    this.isOEEModalOpen = true;
    console.log(this.isOEEModalOpen);
  }

  // 关闭 OEE 模态框的方法
  closeOEEModal(): void {
    this.isOEEModalOpen = false;
  }

  perDonutClick():void {
    console.log('Per donut clicked');
    this.isPerModalOpen = true;
    console.log(this.isPerModalOpen);
  }

  closePerModal(): void {
    this.isPerModalOpen = false;
  }

  generateOEEbar(oee: number, ava: number, per: number, qua: number) {
    const OEEArray = [
      ['Availability', (ava).toFixed(2)],
      ['Performance', (per).toFixed(2)],
      ['Quality', (qua).toFixed(2)],
      ['OEE', (oee).toFixed(2)]
    ];
  
    const chart = c3.generate({
      bindto: '#OEEbar',
      size: {
        height: 200,
        width: 400
      },
      data: {
        columns: OEEArray,
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
          top: 50,
          bottom: 0
        },
        tick: {
          format: d3.format('%'),
          values: [0.25, 0.5, 0.75, 1, 1.25, 1.5],
          count: 6
        }
      },
      bar: {
        width: {
          ratio: 0.8 // this makes bar width 80% of length between ticks
        }
      }
    });
  }

  reportbarPer(chart, array){
    var chart = c3.generate({
      bindto: '#' + chart,
      size: {
          height: 200,
          width: 330
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
          //width: {
          //    ratio: 0.9 // this makes bar width 50% of length between ticks
          //}
          width: 20
      }
  });
  }

  private drawGantt(tasks: any[], taskStatus: any, taskNames: string[], timeInterval: string, timeStart: Date, timeEnd: Date): void {
    //const element = this.el.nativeElement;
    //d3.select(element).select('#gantt').remove();
    d3.select('#gantt').selectAll('*').remove();
    
    const FIT_TIME_DOMAIN_MODE = 'fit';
    const FIXED_TIME_DOMAIN_MODE = 'fixed';

    let margin = { top: 20, right: 300, bottom: 20, left: 90 };
    let timeDomainStart = d3.timeDay.offset(new Date(), -7);
    let timeDomainEnd = d3.timeHour.offset(new Date(), +7);
    let timeDomainMode = FIT_TIME_DOMAIN_MODE;
    let height = 100 - margin.top - margin.bottom - 5;
    let width = document.body.clientWidth - margin.right - margin.left - 5;
    let tickFormat = '%d/%m';

    const keyFunction = function (d) {
      return moment(d.startDate).toDate() + d.taskName + moment(d.endDate).toDate();
    };

    const rectTransform = function (d) {
      return 'translate(' + x(moment(d.startDate).toDate()) + ',' + y(d.taskName) + ')';
    };

    let x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
    let y = d3.scaleBand().domain(taskNames).rangeRound([0, height - margin.top - margin.bottom], 0.1);
    let xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8);
    let yAxis = d3.axisLeft(y).tickSize(0);

    function initTimeDomain() {
      if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
        if (tasks.length < 1) {
          timeDomainStart = d3.timeDay.offset(new Date(), -7);
          timeDomainEnd = d3.timeHour.offset(new Date(), +7);
          return;
        }
        tasks.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        timeDomainEnd = moment(tasks[tasks.length - 1].endDate).toDate();
        tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        timeDomainStart = d3.timeDay.offset(timeDomainEnd, -1);
      }
    }

    function initAxis() {
      x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
      y = d3.scaleBand().domain(taskNames).rangeRound([0, height - margin.top - margin.bottom], 0.1);
      xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8);
      yAxis = d3.axisLeft(y).tickSize(0);
    }

    function gantt(tasks, element) {
      d3.select('#gantt').selectAll('*').remove();

      initTimeDomain();
      initAxis();
      const svg = d3.select(element).append('svg')
        .attr('class', 'chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'gantt-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      svg.selectAll('.chart')
        .data(tasks, keyFunction).enter()
        .append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('class', d => taskStatus[d.status] == null ? 'bar' : taskStatus[d.status])
        .attr('y', 0)
        .attr('transform', rectTransform)
        .attr('height', d => y.bandwidth())
        .attr('width', d => x(moment(d.endDate).toDate()) - x(moment(d.startDate).toDate()));

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(-30)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');

      svg.append('g').attr('class', 'y axis').call(yAxis);
      return gantt;
    }

    gantt(tasks, "#gantt");

    function changeTimeDomain(timeDomainString, timeStart, timeEnd) {
      switch (timeDomainString) {
        case '1hr':
          tickFormat = '%d/%m';
          gantt.timeDomain([d3.timeHour.offset(moment(getEndDate()).toDate(), -1), moment(getEndDate()).toDate()]);
          break;
        case '3hr':
          tickFormat = '%d/%m';
          gantt.timeDomain([d3.timeHour.offset(moment(getEndDate()).toDate(), -3), moment(getEndDate()).toDate()]);
          break;
        case '6hr':
          tickFormat = '%d/%m';
          gantt.timeDomain([d3.timeHour.offset(moment(getEndDate()).toDate(), -6), moment(getEndDate()).toDate()]);
          break;
        case '1day':
          tickFormat = '%d/%m';
          gantt.timeDomain([d3.timeDay.offset(moment(getEndDate()).toDate(), -1), moment(getEndDate()).toDate()]);
          break;
        case '1week':
          tickFormat = '%d/%m';
          gantt.timeDomain([d3.timeDay.offset(moment(getEndDate()).toDate(), -7), moment(getEndDate()).toDate()]);
          break;
      }
      if (timeStart && timeEnd) {
        const start = moment(timeStart).toDate();
        const end = moment(timeEnd).toDate();
        gantt.timeDomain([start, end]);
      }
      gantt.redraw(tasks, "#gantt");
    }

    gantt.timeDomain = function (value) {

      if (!arguments.length)
          return [timeDomainStart, timeDomainEnd];
      timeDomainStart = value[0], timeDomainEnd = value[1];
      return gantt;
  };

  gantt.redraw = function (tasks, element) {
    console.log("testing, in redraw");
    initAxis();
    var svg = d3.select(element);

    var ganttChartGroup = svg.select(".gantt-chart");
    var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

    rect.enter()
     .insert("rect", ":first-child")
     .attr("rx", 5)
     .attr("ry", 5)
 .attr("class", function (d) {
     if (taskStatus[d.status] == null) { return "bar"; }
     return taskStatus[d.status];
 })
 .transition()
 .attr("y", 0)
 .attr("transform", rectTransform)
 .attr("height", function (d) { return y.rangeBand(); })
 .attr("width", function (d) {
     return (x(new Date(d.endDate)) - x(new Date(d.startDate)));
 });

    rect.transition()
      .attr("transform", rectTransform)
 .attr("height", function (d) { return y.rangeBand(); })
 .attr("width", function (d) {
     return (x(new Date(d.endDate)) - x(new Date(d.startDate)));

 });

    rect.exit().remove();

    svg.select(".x").transition().call(xAxis);
    svg.select(".y").transition().call(yAxis);

    return gantt;
};
    function getEndDate() {
      let lastEndDate = new Date();
      if (tasks.length > 0) {
        lastEndDate = tasks[tasks.length - 1].endDate;
      }
      return lastEndDate;
    }
  }


  drawGanttForJobs(tasks: any[], taskStatus: any, taskNames: string[], timeInterval: string, timeStart: Date, timeEnd: Date, colorArray: any[]) {
    const colorArr = colorArray;
    d3.select('#gantt2').selectAll('*').remove(); // 清除现有的图表

    const FIT_TIME_DOMAIN_MODE = 'fit';
    const FIXED_TIME_DOMAIN_MODE = 'fixed';

    const margin = {
      top: 20,
      right: 300,
      bottom: 20,
      left: 90
    };
    let timeDomainStart = moment().subtract(7, 'days').toDate();
    let timeDomainEnd = moment().add(7, 'hours').toDate();
    const timeDomainMode = FIT_TIME_DOMAIN_MODE;

    const height = 130 - margin.top - margin.bottom - 5;
    const width = document.body.clientWidth - margin.right - margin.left - 5;

    let tickFormat = '%d/%m';

    const keyFunction = function (d) {
      return moment(d.startDate).toDate() + d.taskName + moment(d.endDate).toDate();
    };

    const rectTransform = function (d) {
      return 'translate(' + x(moment(d.startDate).toDate()) + ',' + y(d.taskName) + ')';
    };

    let x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

    let y = d3.scaleBand().domain(taskNames).rangeRound([0, height - margin.top - margin.bottom]).padding(0.1);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8);
    const yAxis = d3.axisLeft(y).tickSize(0);

    const initTimeDomain = () => {
      if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
        if (!tasks || tasks.length < 1) {
          timeDomainStart = moment().subtract(7, 'days').toDate();
          timeDomainEnd = moment().add(7, 'hours').toDate();
          return;
        }
        tasks.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        timeDomainEnd = moment(tasks[tasks.length - 1].endDate).toDate();
        tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        timeDomainStart = moment(timeDomainEnd).subtract(1, 'days').toDate();
      }
    };

    const initAxis = () => {
      x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
      y = d3.scaleBand().domain(taskNames).rangeRound([0, height - margin.top - margin.bottom]).padding(0.1);
      xAxis.scale(x);
      yAxis.scale(y);
    };

    const gantt = (tasks, element) => {
      initTimeDomain();
      initAxis();
      const svg = d3.select(element).append('svg')
        .attr('class', 'chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'gantt-chart')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      svg.selectAll('.chart')
        .data(tasks, keyFunction).enter()
        .append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('class', function (d) {
          if (!taskStatus[d.Job]) { return 'bar'; }
          return taskStatus[d.Job];
        })
        .attr('y', 0)
        .attr('transform', rectTransform)
        .attr('task-start', function (d) { return d.startDate; })
        .attr('task-end', function (d) { return d.endDate; })
        .attr('task-status', function (d) { return '"' + d.Job + '"'; })
        .attr('height', function (d) { return y.bandwidth(); })
        .attr('width', function (d) {
          const diff = x(moment(d.endDate).toDate()) - x(moment(d.startDate).toDate());
          return diff;
        });

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
        .transition()
        .call(xAxis)
        .selectAll('text')
        .attr('font-size', '.8em')
        .attr('transform', 'rotate(-30)');

      svg.append('g').attr('class', 'y axis')
        .transition()
        .call(yAxis)
        .selectAll('text')
        .attr('font-size', '.9em');

      colorArr.forEach((item) => {
        const classVar = '.bar-' + item.substring(1);
        d3.selectAll(classVar).style('fill', item); // 设置 CSS 颜色属性
      });

      return gantt;
    };

    gantt.redraw = (tasks, element) => {
      initAxis();
      const svg = d3.select(element);

      const ganttChartGroup = svg.select('.gantt-chart');
      const rect = ganttChartGroup.selectAll('rect').data(tasks, keyFunction);

      rect.enter()
        .insert('rect', ':first-child')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('class', function (d) {
          if (!taskStatus[d.status]) { return 'bar'; }
          return taskStatus[d.status];
        })
        .transition()
        .attr('y', 0)
        .attr('transform', rectTransform)
        .attr('height', function (d) { return y.bandwidth(); })
        .attr('width', function (d) {
          return (x(new Date(d.end)) - x(new Date(d.start)));
        });

      rect.transition()
        .attr('transform', rectTransform)
        .attr('height', function (d) { return y.bandwidth(); })
        .attr('width', function (d) {
          return (x(new Date(d.end)) - x(new Date(d.start)));
        });

      rect.exit().remove();

      svg.select('.x').transition().call(xAxis);
      svg.select('.y').transition().call(yAxis);

      return gantt;
    };

    tasks.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    const maxDate = moment(tasks[tasks.length - 1].endDate).toDate();
    tickFormat = '%d/%m';
    const minDate = moment(tasks[0].startDate).toDate();
    timeInterval = timeInterval || '1day';
    const gantt1 = gantt(tasks, '#gantt2');
    gantt1.redraw = (tasks, element) => {
      console.log("testing, in redraw");
      initAxis();
      var svg = d3.select(element);

      var ganttChartGroup = svg.select(".gantt-chart");
      var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

      rect.enter()
       .insert("rect", ":first-child")
       .attr("rx", 5)
       .attr("ry", 5)
   .attr("class", function (d) {
       if (taskStatus[d.status] == null) { return "bar"; }
       return taskStatus[d.status];
   })
   .transition()
   .attr("y", 0)
   .attr("transform", rectTransform)
   .attr("height", function (d) { return y.rangeBand(); })
   .attr("width", function (d) {
       return (x(new Date(d.endDate)) - x(new Date(d.startDate)));
   });

      rect.transition()
        .attr("transform", rectTransform)
   .attr("height", function (d) { return y.rangeBand(); })
   .attr("width", function (d) {
       return (x(new Date(d.endDate)) - x(new Date(d.startDate)));

   });

      rect.exit().remove();

      svg.select(".x").transition().call(xAxis);
      svg.select(".y").transition().call(yAxis);

      return gantt;
  };
  }

  
//   calculateWhatIF(){ 
//     // alert($scope.totalQty);
//      var UDT =0;
//      var UDT_before=0;
//      var SPT;
//      var PDT;
//      var IOT;//==from table0
//      var IOTsetup;
//      var totalIOT_before;
//      var totalIOT_after;
//      var totalTargetHrs_plannedDownTime = 0;
//      var totalTargetHrs_stoppageAndBreakdown = 0;
//      var sumSetupLoss = 0;
//      var sumSavedHours_setup = 0;
//      var sumSavedHours_stoppageAndBreakdown = 0;
//      var sumHours_stoppageAndBreakdown = 0;
//      var sumHours_setup = 0;
//      var sumSavedHours_PDT = 0;
//      var sumSavedHours_speedloss = 0;
//      var P = 0;
//      var P_after = 0 ;
//      var speedloss_new = 0;
//      var speedloss_before = 0;
//      var speedloss_after = 0;
//      var PDT_before = 0
//      //add02102020
//      var scrap_new = 0
//       //
//       this.whatIfData.foreach((item)=> {
//      if (item.Status == 'speedloss'){
//              sumSavedHours_speedloss =  item.savedHours;
//              speedloss_before = Number(item.second)/60;
//              speedloss_after = Number(item.targetedHours);
//       }	
//       if (item.LossType == 'Planned DownTime'){
//              totalTargetHrs_plannedDownTime = totalTargetHrs_plannedDownTime + Number(item.targetedHours); 
//              PDT_before = PDT_before + Number(item.second)
//       }
//       if (item.Status == 'Setup'){
//              sumSavedHours_setup = sumSavedHours_setup + item.savedHours;
//              sumHours_setup = sumHours_setup +Number(item.second); 
//              sumSetupLoss = sumSetupLoss +Number(item.targetedHours); 
//       }
//          if (item.Status == 'No Schedule')
//              sumSavedHours_PDT = sumSavedHours_PDT + item.savedHours;
//          if (item.Status == 'Stoppage' || item.Status == 'Breakdown') {
//              console.log("item: " + JSON.stringify(item));

//              totalTargetHrs_stoppageAndBreakdown = totalTargetHrs_stoppageAndBreakdown + Number(item.targetedHours);
//             // console.log("Number(item.second): " + item.second);

//              sumHours_stoppageAndBreakdown = sumHours_stoppageAndBreakdown + Number(item.second);  
//          }
 
//       if (item.LossType == 'Availability Loss') {
//           UDT = UDT + Number(item.targetedHours);
//           UDT_before = UDT_before + Number(item.second);  
//         }
//         //add02102020
//       if (item.Status == 'Quality loss')
//       {
//         scrap_new = Number(item.targetedHours);
//       }
//  //
//      });
//      console.log("sumHours_stoppageAndBreakdown in sec: " + sumHours_stoppageAndBreakdown);

//      PDT = totalTargetHrs_plannedDownTime;
//      SPT = this.tableZero[0].SPT / 3600; //converting to hours
//      P = $scope.tableZero[0].P ;
//      speedloss_new = (1-P)*((SPT - PDT) - UDT)
//      UDT_before = UDT_before/60 ;
//      PDT_before = PDT_before/60;

//      var speedLoss = $scope.tableZero[0].speedloss;
   
//      sumHours_stoppageAndBreakdown = sumHours_stoppageAndBreakdown / 60; //connvert from mins to hours
//      if(speedloss_before.toFixed(2) != speedloss_after.toFixed(2))
//      {
//         speedloss_new = speedloss_after
//       }
//     $scope.setupLossToShow = speedloss_new;
//     P_after =  1- (speedloss_new / ((SPT - PDT) - UDT));
// /*
// if( ((SPT - PDT - UDT)-(SPT - PDT - UDT_before) ) == 0 )
// {
//  totalIOT_after = (SPT - PDT - UDT_before) + (speedloss_before - speedloss_new) *P_after
// }
// if( ((SPT - PDT - UDT)-(SPT - PDT - UDT_before) ) != 0 )
// {
//  totalIOT_after =  (SPT - PDT - UDT_before) + ((SPT - PDT - UDT)-(SPT - PDT - UDT_before) )*P_after ;
// }
// */
//     totalIOT_after = SPT - PDT - UDT - speedloss_new //(SPT - PDT - UDT_before) + ((SPT - PDT - UDT)-(SPT - PDT - UDT_before) )*P_after +(speedloss_before - speedloss_new) *P_after;
//     totalIOT_before = (SPT - PDT_before - UDT_before - speedloss_before) ;

//     $scope.totalQty = totalIOT_after * ( $scope.originalTotalQty/totalIOT_before);  //total qty after calculation

//      //$scope.setupLossToShow = sumSetupLoss - sumSavedHours_setup;
//      console.log("setup: " + $scope.setupLossToShow);
//      $scope.A_new_value = 1 - (UDT / (SPT - PDT));
//      //$scope.P_new_value = totalIOT_after / ((SPT - PDT) - UDT);
//     $scope.P_new_value = P_after;
     
// //add02102020
//     $scope.Q_new_value = 1-(scrap_new/$scope.totalQty);
//      $scope.OEE_new_value = $scope.A_new_value * $scope.P_new_value * $scope.Q_new_value; // A * P * Q; Q is always 1     
//      //
// //$scope.OEE_new_value = $scope.A_new_value * $scope.P_new_value * $scope.Q_value; // A * P * Q; Q is always 1     

//      console.log("P: " + P);
//      console.log("speedloss_new: " + speedloss_new);
//      console.log("speedloss_before: " + speedloss_before);
//      console.log("speedloss_after: " + speedloss_after);
//      console.log("PDT: " + PDT);
//      console.log("SPT: " + SPT);
//      console.log("IOTbefore: " + totalIOT_before);
//      console.log("IOTafter: " + totalIOT_after);
//      console.log("UDT: " + UDT);
//      console.log("sumSavedHours_stoppageAndBreakdown: " + sumSavedHours_stoppageAndBreakdown);
//      console.log("sumSavedHours_speedloss: " + sumSavedHours_speedloss);
//      //     alert("Calculation done!");

//  }

// redirectToWhatifReport() {
//   localStorage.setItem('whatIfData', JSON.stringify(this.whatIfData));

//   var resultArr = [this.OEE.toFixed(2), this.A.toFixed(2), this.P.toFixed(2), this.originalTotalQty, this.setupLossToShowFirst.toFixed(2),
//                     this.OEE_new_value.toFixed(2), this.A_new_value.toFixed(2), 
//                     this.P_new_value.toFixed(2), this.totalQty.toFixed(0), this.setupLossToShow,
//                     this.MachineName, this.currentDate, this.periodSelected_inDays,
//         this.Q.toFixed(2),this.Q_new_value.toFixed(2)];
//   localStorage.setItem('result', resultArr);
//   // window.location.href = 'OEE_report.html';
//   window.open(
//       'whatIfReport.html',
//       '_blank' // <- This is what makes it open in a new Tab.
//   );
// }

navigateToOeeReportwithID() {
  const formattedStartDate = this.formatDateToIso(this.startdate);
    const formattedEndDate = this.formatDateToIso(this.enddate);
  this.router.navigate(['/oee-report-withID',this.MachineID,formattedStartDate,formattedEndDate]); // 跳转到 OEE 报告页面
 
}

private formatDateToIso(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

redirectToAvailabilityReport(){
  const formattedStartDate = this.formatDateToIso(this.startdate);
  const formattedEndDate = this.formatDateToIso(this.enddate);
  this.router.navigate(['/ava-report',this.MachineID,formattedStartDate,formattedEndDate]);//ava-report/:machineId/:startdate/:enddate
}

onStartDateSelect() {
  this.maxDate = new Date(); 
  console.log('Selected date:', this.startdate);
}

onEndDateSelect() {
  this.maxDate = new Date(); 
  console.log('Selected date:', this.enddate);
}
}
