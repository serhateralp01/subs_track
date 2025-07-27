import React from 'react';
import { Subscription } from '../types';
import SubscriptionForm from './SubscriptionForm';

interface EditModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSubscription: Omit<Subscription, 'id'>) => void;
}

const EditModal: React.FC<EditModalProps> = ({ subscription, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const handleSave = (updatedSubscription: Omit<Subscription, 'id'>) => {
    onSave(updatedSubscription);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Edit Subscription</h2>
            <p className="text-slate-400 mt-1">Update your subscription details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-300"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <SubscriptionForm
            addSubscription={handleSave}
            initialData={subscription}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModal; 