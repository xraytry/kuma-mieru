export interface Heartbeat {
  status: number; // 0: down, 1: up, 2: maintenance
  time: string;
  msg: string;
  ping: number | null; // latency in ms
}

export interface UptimeData {
  [key: string]: number; // Format: "{monitorId}_{hours}" -> uptime percentage
}

export interface MonitorTag {
  id: number;
  monitor_id: number;
  tag_id: number;
  name: string;
  value?: string;
  color: string;
}

export interface Monitor {
  id: number;
  name: string;
  sendUrl: number; // 0: no, 1: yes
  // server/model/monitor.js (Uptime Kuma)
  type:
    | 'keyword'
    | 'http'
    | 'ping'
    | 'port'
    | 'push'
    | 'socket'
    | 'sqlserver'
    | 'json-query'
    | 'real-browser'
    | 'kafka-producer'
    | 'redis'
    | 'radius'
    | 'mysql'
    | 'postgres'
    | 'gamedig'
    | 'dns'
    | 'steam'
    | 'mqtt'
    | 'tcp'
    | 'docker';
  url?: string;
  certExpiryDaysRemaining?: number; // only for 'http', 'keyword', 'certexpiry', 'json-query'
  validCert?: boolean; // only for cert expiry monitor
  tags?: MonitorTag[];
}

export interface MonitorGroup {
  id: number;
  name: string;
  weight: number;
  monitorList: Monitor[];
}

export interface HeartbeatData {
  [key: string]: Heartbeat[]; // key is monitor ID
}

export interface MonitoringData {
  heartbeatList: HeartbeatData;
  uptimeList: UptimeData;
}

/**
 * Incident Message (Maintenance)
 */
export interface Incident {
  id: number;
  style: 'info' | 'warning' | 'danger' | 'primary' | 'light' | 'dark';
  // info -> primary
  // light -> default
  // dark -> secondary
  title: string;
  content: string;
  pin: number;
  createdDate: string;
  lastUpdatedDate: string;
}

/**
 * Monitor Response
 */
export interface MonitorResponse {
  success: boolean;
  monitorGroups: MonitorGroup[];
  data: MonitoringData;
}

/*
 * Monitor Card Props
 */
export interface MonitorCardProps {
  monitor: Monitor;
  heartbeats: Heartbeat[];
  uptime24h: number;
  isHome?: boolean;
  isLiteView?: boolean;
  disableViewToggle?: boolean;
}
