import React from 'react';
import { Power, Droplets, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';
import { ValveSettings } from '../types';

interface ValveControlProps {
  valve: ValveSettings;
  isConnected: boolean;
  currentTemp: number;
  tempUnit: 'C' | 'F';
  onToggle: (isOpen: boolean) => void;
  onTempChange: (temp: number) => void;
  color: 'blue' | 'teal';
}

export const ValveControl: React.FC<ValveControlProps> = ({
  valve,
  isConnected,
  currentTemp,
  tempUnit,
  onToggle,
  onTempChange,
  color
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      slider: 'accent-blue-600'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      accent: 'text-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700',
      slider: 'accent-teal-600'
    }
  };

  const colors = colorClasses[color];
  
  const shouldBeOpen = currentTemp >= valve.targetTemp;
  const tempDifference = currentTemp - valve.targetTemp;
  
  const getValveStatus = () => {
    if (!isConnected) return 'Nedostupno';
    if (valve.type === 'inlet') {
      return shouldBeOpen ? 'Otvoren (ulaz)' : 'Zatvoren';
    } else {
      return shouldBeOpen ? 'Otvoren (izlaz)' : 'Zatvoren';
    }
  };

  const getStatusIcon = () => {
    if (valve.type === 'inlet') {
      return shouldBeOpen ? <ArrowDown className="h-5 w-5" /> : <Droplets className="h-5 w-5" />;
    } else {
      return shouldBeOpen ? <ArrowUp className="h-5 w-5" /> : <Droplets className="h-5 w-5" />;
    }
  };

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-xl shadow-lg p-6 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${shouldBeOpen ? colors.button : 'bg-gray-200'} text-white transition-colors duration-300`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${colors.text}`}>{valve.name}</h3>
            <p className={`text-sm ${colors.accent} font-medium`}>
              {getValveStatus()}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          valve.isEnabled 
            ? `${colors.button} text-white` 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {valve.isEnabled ? 'AKTIVAN' : 'NEAKTIVAN'}
        </div>
      </div>

      {/* Temperature Settings */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-semibold ${colors.text} flex items-center space-x-2`}>
            <Thermometer className="h-4 w-4" />
            <span>Ciljna temperatura</span>
          </label>
          <span className={`text-lg font-bold ${colors.accent}`}>
            {valve.targetTemp}°{tempUnit}
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={tempUnit === 'C' ? 0 : 32}
            max={tempUnit === 'C' ? 50 : 122}
            step={tempUnit === 'C' ? 0.5 : 1}
            value={valve.targetTemp}
            onChange={(e) => onTempChange(Number(e.target.value))}
            disabled={!valve.isEnabled}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${colors.slider} disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((valve.targetTemp - (tempUnit === 'C' ? 0 : 32)) / (tempUnit === 'C' ? 50 : 90)) * 100}%, #e5e7eb ${((valve.targetTemp - (tempUnit === 'C' ? 0 : 32)) / (tempUnit === 'C' ? 50 : 90)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{tempUnit === 'C' ? '0°C' : '32°F'}</span>
            <span>{tempUnit === 'C' ? '50°C' : '122°F'}</span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Trenutna temp:</span>
            <div className={`text-lg font-bold ${colors.accent}`}>
              {currentTemp.toFixed(1)}°{tempUnit}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Razlika:</span>
            <div className={`text-lg font-bold ${
              tempDifference >= 0 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {tempDifference >= 0 ? '+' : ''}{tempDifference.toFixed(1)}°{tempUnit}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Control */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onToggle(true)}
          disabled={!isConnected || !valve.isEnabled}
          className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${colors.button} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Otvori
        </button>
        <button
          onClick={() => onToggle(false)}
          disabled={!isConnected || !valve.isEnabled}
          className="py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zatvori
        </button>
      </div>

      {/* Auto Status Indicator */}
      {valve.isEnabled && isConnected && (
        <div className={`mt-4 p-3 rounded-lg ${
          shouldBeOpen ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              shouldBeOpen ? 'text-green-800' : 'text-blue-800'
            }`}>
              Automatski režim:
            </span>
            <span className={`text-sm font-bold ${
              shouldBeOpen ? 'text-green-900' : 'text-blue-900'
            }`}>
              {shouldBeOpen ? 'OTVORI VENTIL' : 'ZATVORI VENTIL'}
            </span>
          </div>
          <div className={`text-xs mt-1 ${
            shouldBeOpen ? 'text-green-700' : 'text-blue-700'
          }`}>
            {valve.type === 'inlet' 
              ? (shouldBeOpen ? 'Temperatura je dovoljno visoka - omogući ulaz vode' : 'Temperatura je preniska - zaustavi ulaz')
              : (shouldBeOpen ? 'Temperatura je dovoljno visoka - omogući izlaz vode' : 'Temperatura je preniska - zaustavi izlaz')
            }
          </div>
        </div>
      )}
    </div>
  );
};