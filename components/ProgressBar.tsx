import React from 'react';

interface ProgressBarProps {
  daysUntilPayment: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ daysUntilPayment, className = "" }) => {
  // Calculate progress percentage (31 days = 100%, 0 days = 0%)
  const maxDays = 31;
  const progress = Math.max(0, Math.min(100, ((maxDays - daysUntilPayment) / maxDays) * 100));
  
  // Determine color based on days remaining
  const getColorClasses = (days: number) => {
    if (days >= 15 && days <= 31) return 'bg-blue-500'; // Blue: 31-15 days
    if (days >= 10 && days <= 14) return 'bg-green-500'; // Green: 14-10 days
    if (days >= 3 && days <= 9) return 'bg-orange-500'; // Orange: 9-3 days
    if (days >= 0 && days <= 2) return 'bg-red-500'; // Red: 2-0 days
    return 'bg-slate-500'; // Default for overdue
  };

  const getTextColor = (days: number) => {
    if (days >= 15 && days <= 31) return 'text-blue-400';
    if (days >= 10 && days <= 14) return 'text-green-400';
    if (days >= 3 && days <= 9) return 'text-orange-400';
    if (days >= 0 && days <= 2) return 'text-red-400';
    return 'text-slate-400';
  };

  const getStatusText = (days: number) => {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    return `${days} days left`;
  };

  const colorClasses = getColorClasses(daysUntilPayment);
  const textColor = getTextColor(daysUntilPayment);
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