import { Routes } from '@angular/router';
import { AuthGuard } from '@dis/auth/auth.guard';
import { RoleTypes } from '@dis/auth/roles.enum';

/**
 *  BELOW ARE ROUTES USED IN TEMPLATE
 *  DO NOT EDIT
 *
 *  Treat this as a sample when you link your pages in routes.config.ts
 */

// NOTE: Do not add views within /DIS folder (this folder will be updated and your project specific code shouldn't be here)
// The views below are within /DIS folder because we created them and are responsible for updating them
import { LoginComponent } from '@dis/views/login/login.component';
import { SamplePageComponent } from '@dis/views/sample-page/sample-page.component';
import { EditedPageComponent } from '@dis/views/edited-page/edited-page.component';
import {DashboardOneComponent} from '@dis/views/dashboard-one/dashboard-one.component';
import {DashboardTwoComponent} from '@dis/views/dashboard-two/dashboard-two.component';
import {DashboardThreeComponent} from '@dis/views/dashboard-three/dashboard-three.component';
import {TablesComponent} from '@dis/views/tables/tables.component';
import {InputFieldsComponent} from '@dis/views/input-fields/input-fields.component';
import {FormFillingComponent} from '@dis/views/form-filling/form-filling.component';
import { ProfileSettingComponent } from '@dis/components/profile-setting/profile-setting.component';
import { RTMachineStatusComponent } from '@dis/views/rtmachine-status/rtmachine-status.component';
import { MachineDashboardComponent } from '@dis/views/machine-dashboard/machine-dashboard.component';
import { DonutChartComponent } from '@dis/views/machine-dashboard/donut-chart.component';
import{OeeSummaryComponent} from '@dis/views/oee-summary/oee-summary.component';
import { OEEReportComponent } from '@dis/views/oee-report/oee-report.component';
import { OEEReportWithIDComponent } from '@dis/views/oee-report-withID/oee-report-withID.component';
import { AvaReportComponent } from '@dis/views/ava-report/ava-report.component';
import { OeeTrendingComponent } from '@dis/views/oee-trending/oee-trending.component';

export const AppTemplateRoutes: Routes = [
  // Below is how to include a page
  { path: 'login', component: LoginComponent },
  // Below is how to include a page that can be accessed after any user is logged in
  {
    path: 'sample',
    component: SamplePageComponent,
    canActivate: [AuthGuard], // To accept ALL access after login, use AuthGuardService
    data: {
      elevation: [
        
      ] 
    }
  },
  // Below is how to include a page that can be accessed after a user with SPECIFIED role is logged in
  {
    path: 'sample2',
    component: EditedPageComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-one',
    component: DashboardOneComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-two',
    component: DashboardTwoComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-three',
    component: DashboardThreeComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'table',
    component: TablesComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'input-field',
    component: InputFieldsComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'form-filling',
    component: FormFillingComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'setting',
    component: ProfileSettingComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'rt-machine-status',
    component: RTMachineStatusComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'machine-dashboard',
    component: MachineDashboardComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'donut-chart',
    component: DonutChartComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'oee-summary',
    component: OeeSummaryComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'oee-report/:selectDate/:timeRange',
    component: OEEReportComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'oee-report-withID/:machineId/:startdate/:enddate',
    component: OEEReportWithIDComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login /:machineId/:startdate/:enddate
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'ava-report/:machineId/:startdate/:enddate',
    component: AvaReportComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login /:machineId/:startdate/:enddate
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'oee-trending',
    component: OeeTrendingComponent,
    canActivate: [AuthGuard], // ONLY acceptable ELEVATION can access after login /:machineId/:startdate/:enddate
    data: {
      elevation: [

      ] // List out all roles that are acceptable
    }
  },
  { path: '**', redirectTo: '' }
];
