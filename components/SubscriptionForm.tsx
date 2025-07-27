
import React, { useState, useEffect } from 'react';
import { Subscription, Duration, Currency } from '../types';
import { CATEGORIES, PAYERS, CURRENCIES, CURRENCY_SYMBOLS } from '../constants';
import PlusIcon from './icons/PlusIcon';

interface SubscriptionFormProps {
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  initialData?: Subscription;
  isEditing?: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ addSubscription, initialData, isEditing = false }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [bank, setBank] = useState(initialData?.bank || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [payer, setPayer] = useState(initialData?.payer || PAYERS[0]);
  const [website, setWebsite] = useState(initialData?.website || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<Duration>(initialData?.duration || Duration.MONTHLY);
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || Currency.USD);
  const [priceInput, setPriceInput] = useState(initialData ? 
    (initialData.duration === Duration.MONTHLY ? initialData.monthlyPrice.toString() : initialData.annualPrice.toString()) 
    : ''
  );

  const [monthlyPrice, setMonthlyPrice] = useState(initialData?.monthlyPrice || 0);
  const [annualPrice, setAnnualPrice] = useState(initialData?.annualPrice || 0);

  useEffect(() => {
    const price = parseFloat(priceInput) || 0;
    if (duration === Duration.MONTHLY) {
      setMonthlyPrice(price);
      setAnnualPrice(price * 12);
    } else {
      setAnnualPrice(price);
      setMonthlyPrice(price / 12);
    }
  }, [priceInput, duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceInput) {
      alert('Please fill in at least the name and price.');
      return;
    }
    addSubscription({
      name,
      bank,
      category,
      payer,
      website,
      startDate,
      duration,
      monthlyPrice,
      annualPrice,
      currency,
    });
    // Reset form only if not editing
    if (!isEditing) {
      setName('');
      setBank('');
      setCategory(CATEGORIES[0]);
      setPayer(PAYERS[0]);
      setWebsite('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDuration(Duration.MONTHLY);
      setCurrency(Currency.USD);
      setPriceInput('');
    }
  };
  
  const inputStyle = "w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
  const labelStyle = "block text-sm font-medium text-slate-400 mb-1";

  return (
    <div className={`${isEditing ? '' : 'bg-slate-800 p-6 rounded-xl shadow-lg mb-8'}`}>
      {!isEditing && (
        <h2 className="text-2xl font-bold text-emerald-400 mb-6">
          Add New Subscription
        </h2>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelStyle}>Subscription Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="e.g., Netflix" required />
          </div>
          <div>
            <label htmlFor="bank" className={labelStyle}>Payment Method / Bank</label>
            <input id="bank" type="text" value={bank} onChange={(e) => setBank(e.target.value)} className={inputStyle} placeholder="e.g., Chase Sapphire" />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className={labelStyle}>Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="payer" className={labelStyle}>Payer</label>
            <select id="payer" value={payer} onChange={(e) => setPayer(e.target.value)} className={inputStyle}>
              {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="duration" className={labelStyle}>Billing Cycle</label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value as Duration)} className={inputStyle}>
              <option value={Duration.MONTHLY}>Monthly</option>
              <option value={Duration.ANNUALLY}>Annually</option>
            </select>
          </div>
          <div>
            <label htmlFor="currency" className={labelStyle}>Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={inputStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Column 4 */}
        <div className="space-y-4">
            <div>
                <label htmlFor="price" className={labelStyle}>
                    {duration === Duration.MONTHLY ? 'Monthly Price' : 'Annual Price'}
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{CURRENCY_SYMBOLS[currency]}</span>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className={`${inputStyle} pl-7`}
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="monthlyPrice" className={labelStyle}>Calculated Monthly</label>
                <input id="monthlyPrice" type="text" value={`${CURRENCY_SYMBOLS[currency]}${monthlyPrice.toFixed(2)}`} className={`${inputStyle} bg-slate-800 cursor-not-allowed`} readOnly />
            </div>
        </div>
        
        {/* Row 2 */}
        <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="annualPrice" className={labelStyle}>Calculated Annually</label>
                <input id="annualPrice" type="text" value={`${CURRENCY_SYMBOLS[currency]}${annualPrice.toFixed(2)}`} className={`${inputStyle} bg-slate-800 cursor-not-allowed`} readOnly />
            </div>
            <div>
                <label htmlFor="website" className={labelStyle}>Website (optional)</label>
                <input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputStyle} placeholder="https://netflix.com" />
            </div>
            <div>
                <label htmlFor="startDate" className={labelStyle}>Start/Next Bill Date</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyle} />
            </div>
        </div>
        
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <button type="submit" className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
            <PlusIcon className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Subscription' : 'Add Subscription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
