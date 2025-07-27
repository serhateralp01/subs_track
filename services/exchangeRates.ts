import { Currency } from '../types';

// Free exchange rate API
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

export interface ExchangeRates {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  rates: ExchangeRates;
  base: string;
  date: string;
}

let cachedRates: ExchangeRates | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  const now = Date.now();
  
  // Return cached rates if they're still valid
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    // Cache the rates
    cachedRates = data.rates;
    lastFetchTime = now;
    
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return fallback rates if API fails
    return {
      USD: 1.08, // Approximate USD to EUR rate
      EUR: 1.0,
      TRY: 0.033, // Approximate TRY to EUR rate
    };
  }
};

export const convertToEUR = (amount: number, fromCurrency: Currency, rates: ExchangeRates): number => {
  if (fromCurrency === Currency.EUR) {
    return amount;
  }
  
  const rate = rates[fromCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found for ${fromCurrency}`);
    return amount; // Return original amount if rate not found
  }
  
  return amount / rate;
}; 