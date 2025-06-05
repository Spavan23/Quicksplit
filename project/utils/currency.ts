import { currencies } from '@/constants/currencies';

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode) || 
                  { code: currencyCode, symbol: currencyCode, name: currencyCode };
  
  return `${currency.symbol}${amount.toFixed(2)}`;
}