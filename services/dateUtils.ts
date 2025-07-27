import { Subscription, Duration } from '../types';

export const calculateNextPaymentDate = (subscription: Subscription): string => {
  const today = new Date();
  const lastPayment = new Date(subscription.lastPaymentDate);
  const nextPayment = new Date(subscription.nextPaymentDate);
  
  // If next payment date has passed, calculate new next payment date
  if (nextPayment <= today) {
    const newNextPayment = new Date(lastPayment);
    
    if (subscription.duration === Duration.MONTHLY) {
      // Add 1 month to last payment date
      newNextPayment.setMonth(newNextPayment.getMonth() + 1);
    } else {
      // Add 1 year to last payment date
      newNextPayment.setFullYear(newNextPayment.getFullYear() + 1);
    }
    
    return newNextPayment.toISOString().split('T')[0];
  }
  
  return subscription.nextPaymentDate;
};

export const updatePaymentDates = (subscription: Subscription): Subscription => {
  const today = new Date();
  const nextPayment = new Date(subscription.nextPaymentDate);
  
  // If payment is due today or overdue, update the dates
  if (nextPayment <= today) {
    const newLastPayment = new Date(subscription.nextPaymentDate);
    const newNextPayment = new Date(subscription.nextPaymentDate);
    
    if (subscription.duration === Duration.MONTHLY) {
      newNextPayment.setMonth(newNextPayment.getMonth() + 1);
    } else {
      newNextPayment.setFullYear(newNextPayment.getFullYear() + 1);
    }
    
    return {
      ...subscription,
      lastPaymentDate: newLastPayment.toISOString().split('T')[0],
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
    // Monthly payment progress bar configuration (original)
    if (daysUntilPayment >= 15 && daysUntilPayment <= 31) return { color: 'bg-blue-500', textColor: 'text-blue-400' };
    if (daysUntilPayment >= 10 && daysUntilPayment <= 14) return { color: 'bg-green-500', textColor: 'text-green-400' };
    if (daysUntilPayment >= 3 && daysUntilPayment <= 9) return { color: 'bg-orange-500', textColor: 'text-orange-400' };
    if (daysUntilPayment >= 0 && daysUntilPayment <= 2) return { color: 'bg-red-500', textColor: 'text-red-400' };
    return { color: 'bg-slate-500', textColor: 'text-slate-400' };
  }
}; 