
import React, { useState, useEffect } from 'react';
import { Subscription } from './types';
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

  const addSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: new Date().getTime().toString(),
    };
    // Sorting is now handled in the list component
    setSubscriptions(prev => [newSubscription, ...prev]);
  };
  
  const deleteSubscription = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" subscription?`)) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
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
        <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
