
import React, { useState } from 'react';
import { Subscription } from '../types';
import { CURRENCY_SYMBOLS } from '../constants';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import SubscriptionForm from './SubscriptionForm';

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

  const handleEdit = (updatedSubscription: Omit<Subscription, 'id'>) => {
    onEdit(id, updatedSubscription);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-emerald-400">Edit Subscription</h3>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-slate-400 hover:text-slate-300"
          >
            ✕
          </button>
        </div>
        <SubscriptionForm 
          addSubscription={handleEdit}
          initialData={subscription}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-100">{name}</h3>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">{category}</span>
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
  );
};

export default SubscriptionCard;