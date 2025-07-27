
import React from 'react';
import { Subscription, Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../constants';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string, name: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onDelete }) => {
  const [sortBy, setSortBy] = React.useState('name-asc');
  
  // Calculate totals by currency
  const totalsByCurrency = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.currency]) {
      acc[sub.currency] = { monthly: 0, annual: 0 };
    }
    acc[sub.currency].monthly += sub.monthlyPrice;
    acc[sub.currency].annual += sub.annualPrice;
    return acc;
  }, {} as Record<Currency, { monthly: number; annual: number }>);

  const currencyEntries = Object.entries(totalsByCurrency);

  const sortedSubscriptions = React.useMemo(() => {
    const sorted = [...subscriptions];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price-desc':
          return b.monthlyPrice - a.monthlyPrice;
        case 'price-asc':
          return a.monthlyPrice - b.monthlyPrice;
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [subscriptions, sortBy]);

  return (
    <div>
      <div className="bg-slate-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center sticky top-4 z-10 backdrop-blur-sm bg-slate-800/80 gap-4">
        <div className="flex flex-wrap justify-around items-center w-full md:w-auto gap-4">
          {currencyEntries.map(([currency, totals]) => (
            <div key={currency} className="text-center">
              <h4 className="text-slate-400 text-sm font-medium">Total {currency}</h4>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Monthly</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-400">
                    {CURRENCY_SYMBOLS[currency as Currency]}{totals.monthly.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Annual</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-400">
                    {CURRENCY_SYMBOLS[currency as Currency]}{totals.annual.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-auto">
          <label htmlFor="sort-by" className="sr-only">Sort by</label>
          <select 
            id="sort-by" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="date-desc">Next Bill (Newest)</option>
            <option value="date-asc">Next Bill (Oldest)</option>
          </select>
        </div>
      </div>

      {sortedSubscriptions.length === 0 ? (
        <div className="text-center py-16 px-6 bg-slate-800 rounded-xl">
          <h3 className="text-xl font-semibold text-slate-300">No Subscriptions Yet!</h3>
          <p className="text-slate-400 mt-2">Use the form above to add your first subscription.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedSubscriptions.map(sub => (
            <SubscriptionCard key={sub.id} subscription={sub} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;