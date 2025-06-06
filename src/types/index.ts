export interface ValveSettings {
  name: string;
  targetTemp: number;
  isEnabled: boolean;
  type: 'inlet' | 'outlet';
}

export interface SystemStatus {
  temperature: number;
  isConnected: boolean;
  lastUpdate: Date;
  wifiSignal: number;
  uptime: number;
}

export interface Settings {
  valve1: ValveSettings;
  valve2: ValveSettings;
  general: {
    tempUnit: 'C' | 'F';
    updateInterval: number;
    esp32Ip: string;
    autoMode: boolean;
  };
}

export interface ESP32Response {
  temperature: number;
  valve1: boolean;
  valve2: boolean;
  wifiSignal: number;
  uptime: number;
  timestamp: number;
}