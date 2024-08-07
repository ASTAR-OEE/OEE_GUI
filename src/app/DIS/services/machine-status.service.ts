import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MachineStatusService {
  // private apiUrl = 'https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/getallmachine';
  // private OEESumUrl = 'https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/kpi_data';
  // private OEEReportUrl = 'https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/oeeReport';
  // private OEEReportWithIDUrl ='https://e2b0f807-88c3-4e44-b94a-bd556a7140ab.mock.pstmn.io/api/oeeReportWithID';
  // private apiUrl = '/api/kpiservice/getOEE/getAllMachine';
  // private OEESumUrl = '/api/reportservice/kpi_summary';
  // private OEEReportUrl = '/api/reportservice/department_fixed_report';
  // private OEEReportWithIDUrl ='/api/reportservice/machine_report';
  private apiUrl = 'http://localhost:8070/getOEE/getAllMachine';
  private OEESumUrl = 'http://localhost:8007/DepartmentFixedReport';
  private OEEReportUrl = 'http://localhost:8007/DepartmentFixedReport';
  private OEEReportWithIDUrl ='http://localhost:8007/MachineReport/';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  
  getAPQPercentage_Time(time: string,startdate:string): Observable<any> {

    const formattedStartDate = this.formatDateStringToIso(startdate);
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
    console.log(time)
    const url = `${this.OEESumUrl}/${time}/`;
    let params = new HttpParams()
    .set('time_point', formattedStartDate);
    // .set('frequency', time);
    return this.http.get<any>(url, { params });
  }

  private formatDateStringToIso(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('.')[0] + 'Z';
    // if(this.isValidDate(dateString)){    
    //   console.log(dateString);
    //   const date = new Date(dateString);
    //   return date.toISOString().split('.')[0] + 'Z';
    // }else{
    //   return null;
    // }
  }

  private isValidDate(dateString: string | undefined): boolean {
    // 检查日期是否为 undefined
    if (!dateString) {
      return false;
    }
    // 简单的日期格式检查 YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  }

  getReportData(time: string, startdate: string): Observable<any> {
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
    const url = `${this.OEESumUrl}/${time}/`;
    let params = new HttpParams()
      .set('time_point', startdate);
      // .set('frequency', time);
    return this.http.get<any>(url, { params });
  }

  getReportData2(MachineId: string, startdate: string, enddata:string): Observable<any> {
    // const formattedStartTime = startdate.toISOString().split('.')[0] + 'Z';
    // const formattedEndTime = enddata.toISOString().split('.')[0] + 'Z';

    let params = new HttpParams()
      .set('machine_id', MachineId)
      .set('start_date', startdate)
      .set('end_date', enddata);
    return this.http.get<any>(this.OEEReportWithIDUrl, { params });
  }
  
}
