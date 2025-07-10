import React from 'react';
import { PieceColor } from '../types/chess';
import { Clock } from 'lucide-react';

interface PlayerClockProps {
  color: PieceColor;
  name: string;
  time: number;
  isActive: boolean;
  theme: string;
}

export const PlayerClock: React.FC<PlayerClockProps> = ({
  color,
  name,
  time,
  isActive,
  theme
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = time < 30;
  const isCriticalTime = time < 10;

  return (
    <div className={`
      bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 transition-all duration-200
      ${isActive ? 'border-yellow-400 shadow-lg scale-105' : 'border-pink-200'}
      ${isCriticalTime ? 'animate-pulse bg-red-100' : ''}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-4 h-4 rounded-full ${color === 'white' ? 'bg-white border-2 border-gray-400' : 'bg-gray-800'}`} />
        <span className="font-bold text-pink-700">{name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Clock size={20} className={`${isLowTime ? 'text-red-500' : 'text-pink-500'}`} />
        <span className={`text-2xl font-bold ${
          isCriticalTime ? 'text-red-600' : 
          isLowTime ? 'text-orange-600' : 
          'text-pink-700'
        }`}>
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};