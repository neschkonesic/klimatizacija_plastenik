import { useState, useEffect, useCallback } from 'react';
import { ESP32Response, SystemStatus } from '../types';

export const useESP32Connection = (esp32Ip: string, updateInterval: number) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    temperature: 0,
    isConnected: false,
    lastUpdate: new Date(),
    wifiSignal: 0,
    uptime: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!esp32Ip) {
      setConnectionError('IP adresa ESP32 nije podešena');
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://${esp32Ip}/api/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: ESP32Response = await response.json();
        setSystemStatus({
          temperature: data.temperature,
          isConnected: true,
          lastUpdate: new Date(data.timestamp * 1000),
          wifiSignal: data.wifiSignal,
          uptime: data.uptime
        });
        setConnectionError(null);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      let errorMessage = 'Nepoznata greška';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Vreme za konekciju je isteklo';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'ESP32 uređaj nije dostupan. Proverite IP adresu i mrežnu konekciju.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Greška mreže. Proverite da li ste povezani na istu mrežu kao ESP32.';
        } else {
          errorMessage = error.message;
        }
      }

      setConnectionError(errorMessage);
      setSystemStatus(prev => ({
        ...prev,
        isConnected: false,
        lastUpdate: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  }, [esp32Ip]);

  const sendCommand = useCallback(async (command: string, value?: any) => {
    if (!esp32Ip) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://${esp32Ip}/api/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, value }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Greška pri slanju komande:', error);
      return false;
    }
  }, [esp32Ip]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, updateInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchData, updateInterval]);

  return { systemStatus, isLoading, connectionError, sendCommand, refetch: fetchData };
};