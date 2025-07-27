
import React from 'react';
import { Subscription, Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../constants';
import { fetchExchangeRates, convertToEUR, ExchangeRates } from '../services/exchangeRates';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string, updatedSubscription: Omit<Subscription, 'id'>) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onDelete, onEdit }) => {
  const [sortBy, setSortBy] = React.useState('name-asc');
  const [exchangeRates, setExchangeRates] = React.useState<ExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = React.useState(false);
  const [lastUpdateTime, setLastUpdateTime] = React.useState<Date | null>(null);
  
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

  // Calculate EUR totals
  const eurTotals = React.useMemo(() => {
    if (!exchangeRates) return { monthly: 0, annual: 0 };
    
    let totalMonthlyEUR = 0;
    let totalAnnualEUR = 0;
    
    subscriptions.forEach(sub => {
      const monthlyEUR = convertToEUR(sub.monthlyPrice, sub.currency, exchangeRates);
      const annualEUR = convertToEUR(sub.annualPrice, sub.currency, exchangeRates);
      totalMonthlyEUR += monthlyEUR;
      totalAnnualEUR += annualEUR;
    });
    
    return { monthly: totalMonthlyEUR, annual: totalAnnualEUR };
  }, [subscriptions, exchangeRates]);

  // Fetch exchange rates on component mount
  React.useEffect(() => {
    const loadExchangeRates = async () => {
      setIsLoadingRates(true);
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLastUpdateTime(new Date());
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadExchangeRates();
  }, []);

  const refreshExchangeRates = async () => {
    setIsLoadingRates(true);
          try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLastUpdateTime(new Date());
      } catch (error) {
        console.error('Failed to refresh exchange rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
  };

  const sortedSubscriptions = React.useMemo(() => {
    const sorted = [...subscriptions];
    sorted.sort((a, b) => {
      // Helper function to calculate days until payment
      const getDaysUntilPayment = (subscription: Subscription) => {
        const today = new Date();
        const nextPaymentDate = new Date(subscription.startDate + 'T00:00:00');
        
        if (nextPaymentDate < today) {
          const daysToAdd = subscription.duration === 'Monthly' ? 30 : 365;
          nextPaymentDate.setDate(nextPaymentDate.getDate() + daysToAdd);
        }
        
        const timeDiff = nextPaymentDate.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
      };

      switch (sortBy) {
        case 'price-desc':
          return b.monthlyPrice - a.monthlyPrice;
        case 'price-asc':
          return a.monthlyPrice - b.monthlyPrice;
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'urgency-desc':
          return getDaysUntilPayment(a) - getDaysUntilPayment(b); // Most urgent first
        case 'urgency-asc':
          return getDaysUntilPayment(b) - getDaysUntilPayment(a); // Least urgent first
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
          {/* EUR Total (Converted) */}
          <div className="text-center bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h4 className="text-emerald-400 text-sm font-medium">
                Total EUR (Converted)
              </h4>
              <button
                onClick={refreshExchangeRates}
                disabled={isLoadingRates}
                className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh exchange rates"
              >
                {isLoadingRates ? '🔄' : '🔄'}
              </button>
            </div>
                          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Monthly</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-400">
                    €{eurTotals.monthly.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Annual</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-400">
                    €{eurTotals.annual.toFixed(2)}
                  </p>
                </div>
              </div>
              {lastUpdateTime && (
                <p className="text-xs text-slate-500 mt-1">
                  Updated: {lastUpdateTime.toLocaleTimeString()}
                </p>
              )}
          </div>
          
          {/* Individual Currency Totals */}
          {currencyEntries.map(([currency, totals]) => (
            <div key={currency} className="text-center">
              <h4 className="text-slate-400 text-sm font-medium">Total {currency}</h4>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Monthly</p>
                  <p className="text-lg md:text-xl font-bold text-slate-100">
                    {CURRENCY_SYMBOLS[currency as Currency]}{totals.monthly.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Annual</p>
                  <p className="text-lg md:text-xl font-bold text-slate-100">
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
            <option value="urgency-desc">Most Urgent First</option>
            <option value="urgency-asc">Least Urgent First</option>
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
            <SubscriptionCard key={sub.id} subscription={sub} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;