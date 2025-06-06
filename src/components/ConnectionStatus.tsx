import React from 'react';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { SystemStatus } from '../types';

interface ConnectionStatusProps {
  systemStatus: SystemStatus;
  isLoading: boolean;
  connectionError: string | null;
  onRetry: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  systemStatus,
  isLoading,
  connectionError,
  onRetry
}) => {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return 'Odličan';
    if (signal > -60) return 'Dobar';
    if (signal > -70) return 'Umeren';
    return 'Slab';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Povezivanje sa ESP32...</span>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-2">Greška konekcije</h3>
            <p className="text-red-700 text-sm mb-4">{connectionError}</p>
            <div className="bg-red-50 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-red-900 mb-2">Kako rešiti:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Proverite da li je ESP32 uključen</li>
                <li>• Potvrdite IP adresu u podešavanjima</li>
                <li>• Povežite se na istu Wi-Fi mrežu kao ESP32</li>
                <li>• Ako ESP32 radi u AP režimu, povežite se direktno na njegovu mrežu</li>
              </ul>
            </div>
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Pokušaj ponovo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Status konekcije</h2>
        <div className="flex items-center space-x-2">
          {systemStatus.isConnected ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            systemStatus.isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            {systemStatus.isConnected ? 'Povezano' : 'Nije povezano'}
          </span>
        </div>
      </div>

      {systemStatus.isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Jačina signala</div>
            <div className="text-lg font-bold text-blue-900">
              {systemStatus.wifiSignal} dBm
            </div>
            <div className="text-xs text-blue-700">
              {getSignalStrength(systemStatus.wifiSignal)}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Vreme rada</div>
            <div className="text-lg font-bold text-green-900">
              {formatUptime(systemStatus.uptime)}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Poslednje ažuriranje</div>
            <div className="text-lg font-bold text-purple-900">
              {systemStatus.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};