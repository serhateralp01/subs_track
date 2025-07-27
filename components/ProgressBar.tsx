import React from 'react';
import { Duration } from '../types';
import { getProgressBarConfig } from '../services/dateUtils';

interface ProgressBarProps {
  daysUntilPayment: number;
  duration: Duration;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ daysUntilPayment, duration, className = "" }) => {
  // Calculate progress percentage based on duration
  const maxDays = duration === Duration.ANNUALLY ? 365 : 31;
  const progress = Math.max(0, Math.min(100, ((maxDays - daysUntilPayment) / maxDays) * 100));
  
  // Get color configuration based on duration and days
  const { color: colorClasses, textColor } = getProgressBarConfig(daysUntilPayment, duration);

  const getStatusText = (days: number) => {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    return `${days} days left`;
  };

  const statusText = getStatusText(daysUntilPayment);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-xs">
        <span className={textColor}>Next Payment</span>
        <span className={textColor}>{statusText}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 