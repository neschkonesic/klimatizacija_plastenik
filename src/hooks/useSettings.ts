import { useState, useEffect } from 'react';
import { Settings } from '../types';

const defaultSettings: Settings = {
  valve1: {
    name: 'Ulazni ventil',
    targetTemp: 25,
    isEnabled: true,
    type: 'inlet'
  },
  valve2: {
    name: 'Izlazni ventil',
    targetTemp: 30,
    isEnabled: true,
    type: 'outlet'
  },
  general: {
    tempUnit: 'C',
    updateInterval: 2,
    esp32Ip: '192.168.4.1',
    autoMode: true
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('aquacontrol-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        // Merge with defaults to ensure all properties exist
        setSettings({
          valve1: { ...defaultSettings.valve1, ...parsedSettings.valve1 },
          valve2: { ...defaultSettings.valve2, ...parsedSettings.valve2 },
          general: { ...defaultSettings.general, ...parsedSettings.general }
        });
      } catch (error) {
        console.error('Greška pri učitavanju podešavanja:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings };
    
    if (newSettings.valve1) {
      updated.valve1 = { ...updated.valve1, ...newSettings.valve1 };
    }
    if (newSettings.valve2) {
      updated.valve2 = { ...updated.valve2, ...newSettings.valve2 };
    }
    if (newSettings.general) {
      updated.general = { ...updated.general, ...newSettings.general };
    }

    setSettings(updated);
    localStorage.setItem('aquacontrol-settings', JSON.stringify(updated));
  };

  const updateValveTemp = (valve: 'valve1' | 'valve2', temp: number) => {
    updateSettings({
      [valve]: {
        ...settings[valve],
        targetTemp: temp
      }
    });
  };

  return { settings, updateSettings, updateValveTemp };
};