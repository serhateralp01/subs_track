import { Currency } from './types';

export const CATEGORIES = ['Entertainment', 'Software', 'Work', 'Utilities', 'Health', 'Finance', 'Shopping', 'Other'];
export const PAYERS = ['Personal', 'Partner', 'Shared', 'Company'];

export const CURRENCIES = [Currency.USD, Currency.EUR, Currency.TRY];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.TRY]: '₺',
};
