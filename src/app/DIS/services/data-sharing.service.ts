import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  // mcName: string;
  // deptName: string;
  // jobIDLabel: string;
  // start: string = '2020-05-20';
  // end: string =  '2024-06-20';
  // getChart: string;
  // oeeReport: string;
  // availReport: string;
  // whatIF: string;
  // OEE: string;
  // chinesereport: string;

  //  private kpiUrl = 'https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/calculate_APQ2';
  //  private dpUrl = 'https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/dpUrl';
  //  private kpiUrl = '/api/kpiservice/kpi_data_by_machine';
  //  private dpUrl = '/api/dpservice/getOEE/getJobAndStatus';
   private kpiUrl = 'http://localhost:8060/kpiDataByMachine/';
   private dpUrl = 'http://localhost:8070/getOEE/getJobAndStatus';


  constructor(private http: HttpClient) {}

  getStatus(machine_id: string, start_time: Date, end_time: Date): Observable<any> {
    // 将 start_time 转换为 YYYY-MM-DDTHH:mm:ssZ 格式
    const formattedStartTime = start_time.toISOString().split('.')[0] + 'Z';
    const formattedEndTime = end_time.toISOString().split('.')[0] + 'Z';

    let params = new HttpParams()
      .set('machine_id', machine_id)
      .set('start_time', formattedStartTime)
      .set('end_time', formattedEndTime);

    return this.http.get<any>(this.kpiUrl, { params });
  }

  getTables(machine_id: string, start_time: Date, end_time: Date): Observable<any> {
    const formattedStartTime = start_time.toISOString().split('.')[0] + 'Z';
    const formattedEndTime = end_time.toISOString().split('.')[0] + 'Z';

    let params = new HttpParams()
    .set('machine_id', machine_id)
    .set('start_time', formattedStartTime)
    .set('end_time', formattedEndTime);
    return this.http.get<any>(this.dpUrl, { params });
  }


  // setMcName(mcName: string) {
  //   this.mcName = mcName;
  // }

  // getMcName() {
  //   return this.mcName;
  // }

  // setDeptName(deptName: string) {
  //   this.mcName = deptName;
  // }

  // getDeptName() {
  //   return this.deptName;
  // }

  // setJobIDLabel(jobIDLabel: string) {
  //   this.jobIDLabel = jobIDLabel;
  // }

  // getJobIDLabel() {
  //   return this.jobIDLabel;
  // }

  // setStart(start: string) {
  //   this.start = start;
  // }

  // getStart() {
  //   return this.start;
  // }

  // setEnd(end: string) {
  //   this.end = end;
  // }

  // getEnd() {
  //   return this.end;
  // }

  // setOeeReport(oeeReport: string) {
  //   this.oeeReport =oeeReport;
  // }

  // getOeeReport() {
  //   return this.oeeReport;
  // }

  // setAvailReport(availReport: string) {
  //   this.availReport =availReport;
  // }

  // getAvailReport() {
  //   return this.availReport;
  // }

  // setGetChart( getChart: string) {
  //   this.getChart = getChart;
  // }

  // getGetChart() {
  //   return this.getChart;
  // }

  // setWhatIF(whatIF: string) {
  //   this.whatIF =whatIF;
  // }

  // getWhatIF() {
  //   return this.whatIF;
  // }

  
  // setOEE(OEE: string) {
  //   this.OEE =OEE;
  // }

  // getOEE() {
  //   return this.OEE;
  // }

  // setChinesereport(chinesereport: string) {
  //   this.chinesereport =chinesereport;
  // }

  // getChinesereport() {
  //   return this.chinesereport;
  // }

}
