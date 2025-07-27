
import React, { useState } from 'react';
import { Subscription } from '../types';
import { CURRENCY_SYMBOLS } from '../constants';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import EditModal from './EditModal';
import ProgressBar from './ProgressBar';

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string, updatedSubscription: Omit<Subscription, 'id'>) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onDelete, onEdit }) => {
  const { id, name, category, bank, payer, website, startDate, monthlyPrice, annualPrice, currency } = subscription;
  const [isEditing, setIsEditing] = useState(false);
  
  const formattedDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate days until next payment
  const calculateDaysUntilPayment = () => {
    const today = new Date();
    const nextPaymentDate = new Date(startDate + 'T00:00:00');
    
    // If the payment date has passed, calculate next payment based on duration
    if (nextPaymentDate < today) {
      const duration = subscription.duration;
      const daysToAdd = duration === 'Monthly' ? 30 : 365;
      nextPaymentDate.setDate(nextPaymentDate.getDate() + daysToAdd);
    }
    
    const timeDiff = nextPaymentDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilPayment = calculateDaysUntilPayment();

  const handleEdit = (updatedSubscription: Omit<Subscription, 'id'>) => {
    onEdit(id, updatedSubscription);
  };

  return (
    <>
      <div className="bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-slate-100">{name}</h3>
            <div className="flex items-center gap-2">
              {daysUntilPayment <= 2 && (
                <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full animate-pulse">
                  ⚠️ Due Soon
                </span>
              )}
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">{category}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-400 mb-4">
            <p><span className="font-semibold text-slate-300">Paid with:</span> {bank || 'N/A'}</p>
            <p><span className="font-semibold text-slate-300">Payer:</span> {payer}</p>
            <p><span className="font-semibold text-slate-300">Next Bill:</span> {formattedDate}</p>
            {website && (
              <p>
                <span className="font-semibold text-slate-300">Website:</span>{' '}
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline">
                  Visit site
                </a>
              </p>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar daysUntilPayment={daysUntilPayment} />
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-4 mt-4 flex justify-between items-center">
          <div className="text-left">
            <p className="text-slate-400 text-xs">Monthly</p>
            <p className="text-lg font-semibold text-slate-100">{CURRENCY_SYMBOLS[currency]}{monthlyPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Annually</p>
            <p className="text-lg font-semibold text-slate-100">{CURRENCY_SYMBOLS[currency]}{annualPrice.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-2 bg-slate-700 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-full transition-colors duration-200"
              aria-label={`Edit ${name} subscription`}
            >
              <EditIcon />
            </button>
            <button 
              onClick={() => onDelete(id, name)} 
              className="p-2 bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors duration-200"
              aria-label={`Delete ${name} subscription`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
      
      <EditModal
        subscription={subscription}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleEdit}
      />
    </>
  );
};

export default SubscriptionCard;