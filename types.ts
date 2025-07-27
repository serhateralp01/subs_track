
export enum Duration {
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  TRY = 'TRY',
}

export interface Subscription {
  id: string;
  name: string;
  bank: string;
  category: string;
  payer: string;
  website: string;
  startDate: string;
  duration: Duration;
  monthlyPrice: number;
  annualPrice: number;
  currency: Currency;
}
