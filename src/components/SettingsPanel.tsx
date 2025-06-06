import React, { useState } from 'react';
import { Settings, X, Save, Wifi, Thermometer } from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface SettingsPanelProps {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdate,
  isOpen,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const handleValveChange = (valve: 'valve1' | 'valve2', field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [valve]: {
        ...prev[valve],
        [field]: value
      }
    }));
  };

  const handleGeneralChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Podešavanja sistema</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Valve 1 Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
              <Thermometer className="h-5 w-5" />
              <span>Ventil 1 - Ulazni ventil</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv ventila
                </label>
                <input
                  type="text"
                  value={localSettings.valve1.name}
                  onChange={(e) => handleValveChange('valve1', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings.valve1.isEnabled}
                    onChange={(e) => handleValveChange('valve1', 'isEnabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Omogući ventil</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciljna temperatura za aktivaciju: {localSettings.valve1.targetTemp}°{localSettings.general.tempUnit}
                </label>
                <input
                  type="range"
                  min={localSettings.general.tempUnit === 'C' ? 0 : 32}
                  max={localSettings.general.tempUnit === 'C' ? 50 : 122}
                  step={localSettings.general.tempUnit === 'C' ? 0.5 : 1}
                  value={localSettings.valve1.targetTemp}
                  onChange={(e) => handleValveChange('valve1', 'targetTemp', Number(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{localSettings.general.tempUnit === 'C' ? '0°C' : '32°F'}</span>
                  <span>{localSettings.general.tempUnit === 'C' ? '50°C' : '122°F'}</span>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Ventil se otvara kada temperatura dostigne ili premaši ovu vrednost
                </p>
              </div>
            </div>
          </div>

          {/* Valve 2 Settings */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="font-bold text-teal-900 mb-4 flex items-center space-x-2">
              <Thermometer className="h-5 w-5" />
              <span>Ventil 2 - Izlazni ventil</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv ventila
                </label>
                <input
                  type="text"
                  value={localSettings.valve2.name}
                  onChange={(e) => handleValveChange('valve2', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings.valve2.isEnabled}
                    onChange={(e) => handleValveChange('valve2', 'isEnabled', e.target.checked)}
                    className="w-5 h-5 text-teal-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Omogući ventil</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciljna temperatura za aktivaciju: {localSettings.valve2.targetTemp}°{localSettings.general.tempUnit}
                </label>
                <input
                  type="range"
                  min={localSettings.general.tempUnit === 'C' ? 0 : 32}
                  max={localSettings.general.tempUnit === 'C' ? 50 : 122}
                  step={localSettings.general.tempUnit === 'C' ? 0.5 : 1}
                  value={localSettings.valve2.targetTemp}
                  onChange={(e) => handleValveChange('valve2', 'targetTemp', Number(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{localSettings.general.tempUnit === 'C' ? '0°C' : '32°F'}</span>
                  <span>{localSettings.general.tempUnit === 'C' ? '50°C' : '122°F'}</span>
                </div>
                <p className="text-xs text-teal-700 mt-2">
                  Ventil se otvara kada temperatura dostigne ili premaši ovu vrednost
                </p>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Opšta podešavanja</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ESP32 IP adresa
                </label>
                <input
                  type="text"
                  value={localSettings.general.esp32Ip}
                  onChange={(e) => handleGeneralChange('esp32Ip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="192.168.4.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interval ažuriranja (sekunde)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.general.updateInterval}
                  onChange={(e) => handleGeneralChange('updateInterval', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jedinica temperature
                </label>
                <select
                  value={localSettings.general.tempUnit}
                  onChange={(e) => handleGeneralChange('tempUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings.general.autoMode}
                    onChange={(e) => handleGeneralChange('autoMode', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Automatski režim</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Sačuvaj podešavanja</span>
          </button>
        </div>
      </div>
    </div>
  );
};