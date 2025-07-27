
import React, { useState, useEffect } from 'react';
import { Subscription } from './types';
import { updatePaymentDates } from './services/dateUtils';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const savedSubs = localStorage.getItem('subscriptions');
      return savedSubs ? JSON.parse(savedSubs) : [];
    } catch (error) {
      console.error("Could not parse subscriptions from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    } catch (error) {
      console.error("Could not save subscriptions to localStorage", error);
    }
  }, [subscriptions]);

  // Auto-update payment dates and migrate old subscriptions
  useEffect(() => {
    if (subscriptions.length === 0) return;
    
    const updatedSubscriptions = subscriptions.map(subscription => {
      // Migrate old subscriptions that don't have the new fields
      if (!subscription.nextPaymentDate || !subscription.lastPaymentDate) {
        const startDate = subscription.startDate;
        const nextPaymentDate = new Date(startDate);
        
        if (subscription.duration === 'Monthly') {
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        } else {
          nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
        }
        
        return {
          ...subscription,
          lastPaymentDate: startDate,
          nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
        };
      }
      
      // Update payment dates for existing subscriptions
      return updatePaymentDates(subscription);
    });
    
    // Only update if there are changes
    const hasChanges = updatedSubscriptions.some((updated, index) => 
      updated.nextPaymentDate !== subscriptions[index]?.nextPaymentDate ||
      !subscriptions[index]?.nextPaymentDate
    );
    
    if (hasChanges) {
      setSubscriptions(updatedSubscriptions);
    }
  }, [subscriptions.length]);

  const addSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];
    const startDate = subscriptionData.startDate;
    
    // Calculate next payment date based on duration
    const nextPaymentDate = new Date(startDate);
    if (subscriptionData.duration === 'Monthly') {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }
    
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: new Date().getTime().toString(),
      lastPaymentDate: startDate,
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
    };
    // Sorting is now handled in the list component
    setSubscriptions(prev => [newSubscription, ...prev]);
  };
  
  const deleteSubscription = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" subscription?`)) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const editSubscription = (id: string, updatedSubscription: Omit<Subscription, 'id'>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...updatedSubscription, id } : sub
    ));
  };

  return (
    <div className="min-h-screen">
      <header className="py-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-center text-slate-100 tracking-tight">
          Subscription <span className="text-emerald-400">Tracker</span>
        </h1>
        <p className="text-center text-slate-400 mt-2">Keep your recurring payments in check.</p>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SubscriptionForm addSubscription={addSubscription} />
        <SubscriptionList 
          subscriptions={subscriptions} 
          onDelete={deleteSubscription}
          onEdit={editSubscription}
        />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
