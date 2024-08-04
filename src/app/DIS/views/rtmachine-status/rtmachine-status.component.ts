import { Component, OnInit, OnDestroy } from '@angular/core';
import { MachineStatusService } from '../../services/machine-status.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-rt-machine-status',
  templateUrl: './rtmachine-status.component.html',
  styleUrls: ['./rtmachine-status.component.scss']
})
export class RTMachineStatusComponent implements OnInit, OnDestroy {
  heading: string;
  running: string;
  stoppage: string;
  setup: string;
  breakdown: string;
  noSchedule: string;
  disconnected: string;
  bigData: any[] = [];
  screenW: number = screen.width;
  screenH: number = screen.height;
  refreshSubscription: Subscription;
  private socket: WebSocket;

  constructor(private machineStatusService: MachineStatusService) {
    this.setLabels();
  }

  ngOnInit(): void {
    this.reLoadMachines();
  //   this.refreshSubscription = interval(5000).subscribe(() => this.reLoadMachines());
  //  this.initializeWebSocketConnection();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  setLabels(): void {
    this.heading = this.isLanguageEnglish() ? "Real-time Machine Status" : "实时机器状态";
    this.running = this.isLanguageEnglish() ? "Running" : "机器运行";
    this.setup = this.isLanguageEnglish() ? "Setup" : "设置";
    this.breakdown = this.isLanguageEnglish() ? "Breakdown" : "机器故障";
    this.disconnected = this.isLanguageEnglish() ? "Disconnected" : "网络断开";
    this.stoppage = this.isLanguageEnglish() ? "Stoppage" : "停机";
    this.noSchedule = this.isLanguageEnglish() ? "No Schedule" : "计划停机";
  }

  isLanguageEnglish(): boolean {
    return true; // Modify this to use actual language preference logic
  }

  reLoadMachines(): void {
    this.machineStatusService.getStatus().subscribe(
      (payload) => {
        console.log(payload);
        payload.forEach(item => {
          item.OEE = item.OEE ? (item.OEE * 100).toFixed(2) + "%" : "";
          item.A = item.A ? (item.A * 100).toFixed(2) + "%" : "";
          item.P = item.P ? (item.P * 100).toFixed(2) + "%" : "";
          item.Q = item.Q ? (item.Q * 100).toFixed(2) + "%" : "";
          item.showTable = !(item.OEE === "" && item.A === "" && item.P === "" && item.Q === "");
        });
        this.bigData = payload;
      },
      (errorPayload) => {
        console.error("Error in /api/Machines/GetAllMachines web service", errorPayload);
      }
    );
  }
  private initializeWebSocketConnection(): void {
    this.socket = new WebSocket('ws://localhost:8070/ws');

    this.socket.onopen = (event) => {
      console.log("WebSocket is open now.");
      this.socket.send("getAllMachine");
      // setInterval(() => {
      //   this.socket.send("getAllMachine");
      // }, 5000);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server: ", data);
      this.bigData = data.Machine;
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket is closed now.");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
  }

  
}
