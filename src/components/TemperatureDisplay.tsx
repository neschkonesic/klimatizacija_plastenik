import React from 'react';
import { Thermometer } from 'lucide-react';

interface TemperatureDisplayProps {
  temperature: number;
  unit: 'C' | 'F';
  isConnected: boolean;
}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ 
  temperature, 
  unit, 
  isConnected 
}) => {
  const displayTemp = unit === 'F' ? (temperature * 9/5) + 32 : temperature;
  
  const getTemperatureColor = () => {
    if (!isConnected) return 'text-gray-400';
    if (temperature < 15) return 'text-blue-600';
    if (temperature < 25) return 'text-green-600';
    if (temperature < 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBackgroundGradient = () => {
    if (!isConnected) return 'from-gray-100 to-gray-200';
    if (temperature < 15) return 'from-blue-50 to-blue-100';
    if (temperature < 25) return 'from-green-50 to-green-100';
    if (temperature < 35) return 'from-yellow-50 to-yellow-100';
    return 'from-red-50 to-red-100';
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-xl shadow-lg p-6 mb-6`}>
      <div className="flex items-center justify-center space-x-4">
        <div className={`p-3 rounded-full bg-white shadow-md ${getTemperatureColor()}`}>
          <Thermometer className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Trenutna temperatura
          </h2>
          <div className={`text-4xl font-bold ${getTemperatureColor()} transition-colors duration-300`}>
            {isConnected ? displayTemp.toFixed(1) : '--'}
            <span className="text-2xl ml-1">°{unit}</span>
          </div>
          {!isConnected && (
            <p className="text-sm text-gray-500 mt-2">Čeka se konekcija...</p>
          )}
        </div>
      </div>
    </div>
  );
};