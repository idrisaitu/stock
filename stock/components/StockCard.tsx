import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Stock } from '../types/stock';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgGradient = isPositive 
    ? 'from-green-50 to-emerald-50 border-green-200' 
    : 'from-red-50 to-rose-50 border-red-200';
  const iconBg = isPositive ? 'bg-green-100' : 'bg-red-100';

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 ${bgGradient} p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 animate-fade-in card-hover group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {stock.symbol}
          </h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <div className={`p-2 rounded-xl ${iconBg} ml-3`}>
          {isPositive ? (
            <TrendingUp className={`h-5 w-5 ${changeColor}`} />
          ) : (
            <TrendingDown className={`h-5 w-5 ${changeColor}`} />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900">
            ${stock.price.toFixed(2)}
          </span>
          <div className={`text-right ${changeColor}`}>
            <div className="flex items-center space-x-1 font-semibold text-lg">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{isPositive ? '+' : ''}${stock.change.toFixed(2)}</span>
            </div>
            <div className="text-sm font-medium">
              ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Volume</p>
              <p className="text-sm font-semibold text-gray-900">{formatNumber(stock.volume)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Market Cap</p>
              <p className="text-sm font-semibold text-gray-900">{formatNumber(stock.marketCap || 0)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">High</p>
            <p className="text-sm font-semibold text-gray-900">${stock.high.toFixed(2)}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Low</p>
            <p className="text-sm font-semibold text-gray-900">${stock.low.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};