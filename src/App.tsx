import React, { useState } from 'react';
import { Settings, Droplets } from 'lucide-react';
import { TemperatureDisplay } from './components/TemperatureDisplay';
import { ValveControl } from './components/ValveControl';
import { ConnectionStatus } from './components/ConnectionStatus';
import { SettingsPanel } from './components/SettingsPanel';
import { useSettings } from './hooks/useSettings';
import { useESP32Connection } from './hooks/useESP32Connection';

function App() {
  const { settings, updateSettings, updateValveTemp } = useSettings();
  const { systemStatus, isLoading, connectionError, sendCommand, refetch } = useESP32Connection(
    settings.general.esp32Ip,
    settings.general.updateInterval
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const convertTemperature = (temp: number) => {
    return settings.general.tempUnit === 'F' ? (temp * 9/5) + 32 : temp;
  };

  const handleValveToggle = async (valveId: 'valve1' | 'valve2', isOpen: boolean) => {
    const command = `${valveId}_${isOpen ? 'open' : 'close'}`;
    await sendCommand(command);
    // Refresh data after command
    setTimeout(refetch, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AquaControl Pro</h1>
              <p className="text-gray-600">Sistem za kontrolu ventila sa temperaturnim senzorima</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Podešavanja</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Connection Status */}
          <ConnectionStatus 
            systemStatus={systemStatus}
            isLoading={isLoading}
            connectionError={connectionError}
            onRetry={refetch}
          />

          {/* Temperature Display */}
          <TemperatureDisplay
            temperature={convertTemperature(systemStatus.temperature)}
            unit={settings.general.tempUnit}
            isConnected={systemStatus.isConnected}
          />

          {/* Valve Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ValveControl
              valve={settings.valve1}
              isConnected={systemStatus.isConnected}
              currentTemp={convertTemperature(systemStatus.temperature)}
              tempUnit={settings.general.tempUnit}
              onToggle={(isOpen) => handleValveToggle('valve1', isOpen)}
              onTempChange={(temp) => updateValveTemp('valve1', temp)}
              color="blue"
            />
            <ValveControl
              valve={settings.valve2}
              isConnected={systemStatus.isConnected}
              currentTemp={convertTemperature(systemStatus.temperature)}
              tempUnit={settings.general.tempUnit}
              onToggle={(isOpen) => handleValveToggle('valve2', isOpen)}
              onTempChange={(temp) => updateValveTemp('valve2', temp)}
              color="teal"
            />
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informacije o sistemu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Automatski režim</div>
                <div className={`text-lg font-bold ${settings.general.autoMode ? 'text-green-600' : 'text-gray-600'}`}>
                  {settings.general.autoMode ? 'Uključen' : 'Isključen'}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">Interval ažuriranja</div>
                <div className="text-lg font-bold text-green-900">
                  {settings.general.updateInterval}s
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium">ESP32 IP</div>
                <div className="text-lg font-bold text-purple-900">
                  {settings.general.esp32Ip}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">Jedinica temp.</div>
                <div className="text-lg font-bold text-orange-900">
                  °{settings.general.tempUnit}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;