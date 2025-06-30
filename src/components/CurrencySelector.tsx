import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Currency } from '../types/stock';
import { DollarSign } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useAppContext();

  const currencies: { label: string; value: Currency; symbol: string }[] = [
    { label: 'US Dollar', value: 'USD', symbol: '$' },
    { label: 'Euro', value: 'EUR', symbol: '€' },
    { label: 'British Pound', value: 'GBP', symbol: '£' },
    { label: 'Japanese Yen', value: 'JPY', symbol: '¥' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {currencies.map((curr) => (
            <option key={curr.value} value={curr.value}>
              {curr.symbol} {curr.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};