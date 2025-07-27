import { Subscription, Duration } from '../types';

export const addMonthsToDate = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const addYearsToDate = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

export const updatePaymentDates = (subscription: Subscription): Subscription => {
  const today = new Date();
  const nextPayment = new Date(subscription.nextPaymentDate);
  
  // If payment date has passed, calculate new next payment date
  if (nextPayment <= today) {
    const currentNextPayment = new Date(subscription.nextPaymentDate);
    let newNextPayment: Date;
    
    if (subscription.duration === Duration.MONTHLY) {
      // Add 1 month using setMonth
      newNextPayment = addMonthsToDate(currentNextPayment, 1);
    } else {
      // Add 1 year using setFullYear
      newNextPayment = addYearsToDate(currentNextPayment, 1);
    }
    
    return {
      ...subscription,
      lastPaymentDate: subscription.nextPaymentDate,
      nextPaymentDate: newNextPayment.toISOString().split('T')[0],
    };
  }
  
  return subscription;
};

export const calculateDaysUntilPayment = (subscription: Subscription): number => {
  const today = new Date();
  const nextPayment = new Date(subscription.nextPaymentDate);
  
  const timeDiff = nextPayment.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getProgressBarConfig = (daysUntilPayment: number, duration: Duration) => {
  if (duration === Duration.ANNUALLY) {
    // Annual payment progress bar configuration
    if (daysUntilPayment > 30) return { color: 'bg-blue-500', textColor: 'text-blue-400' };
    if (daysUntilPayment >= 15) return { color: 'bg-green-500', textColor: 'text-green-400' };
    if (daysUntilPayment >= 5) return { color: 'bg-orange-500', textColor: 'text-orange-400' };
    if (daysUntilPayment >= 0) return { color: 'bg-red-500', textColor: 'text-red-400' };
    return { color: 'bg-slate-500', textColor: 'text-slate-400' };
  } else {
    // Monthly payment progress bar configuration
    if (daysUntilPayment >= 15 && daysUntilPayment <= 31) return { color: 'bg-blue-500', textColor: 'text-blue-400' };
    if (daysUntilPayment >= 10 && daysUntilPayment <= 14) return { color: 'bg-green-500', textColor: 'text-green-400' };
    if (daysUntilPayment >= 3 && daysUntilPayment <= 9) return { color: 'bg-orange-500', textColor: 'text-orange-400' };
    if (daysUntilPayment >= 0 && daysUntilPayment <= 2) return { color: 'bg-red-500', textColor: 'text-red-400' };
    return { color: 'bg-slate-500', textColor: 'text-slate-400' };
  }
}; 